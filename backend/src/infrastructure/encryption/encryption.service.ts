import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly authTagLength = 16;
  private readonly saltLength = 64;
  private readonly masterKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    this.masterKey = Buffer.from(encryptionKey, 'hex');
    if (this.masterKey.length !== this.keyLength) {
      throw new Error(`Encryption key must be ${this.keyLength} bytes (64 hex characters)`);
    }
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  encrypt(plaintext: string, tenantId?: string): string {
    try {
      // Generate a unique key for this tenant/data
      const salt = crypto.randomBytes(this.saltLength);
      const key = this.deriveKey(salt, tenantId);
      
      // Generate initialization vector
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv, {
        authTagLength: this.authTagLength,
      });
      
      // Encrypt
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();
      
      // Combine salt + iv + authTag + encrypted data
      const result = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encrypted, 'hex'),
      ]).toString('base64');
      
      return result;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt encrypted data
   */
  decrypt(ciphertext: string, tenantId?: string): string {
    try {
      const buffer = Buffer.from(ciphertext, 'base64');
      
      // Extract components
      const salt = buffer.subarray(0, this.saltLength);
      const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
      const authTag = buffer.subarray(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.authTagLength,
      );
      const encrypted = buffer.subarray(this.saltLength + this.ivLength + this.authTagLength);
      
      // Derive key
      const key = this.deriveKey(salt, tenantId);
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv, {
        authTagLength: this.authTagLength,
      });
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash data using SHA-256 (for non-reversible hashing like passwords)
   */
  hash(data: string, salt?: string): string {
    const hashSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, hashSalt, 100000, 64, 'sha512');
    return `${hashSalt}:${hash.toString('hex')}`;
  }

  /**
   * Verify hashed data
   */
  verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(':');
    const computedHash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512');
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      computedHash,
    );
  }

  /**
   * Generate a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Derive encryption key from master key and salt
   */
  private deriveKey(salt: Buffer, tenantId?: string): Buffer {
    const context = tenantId || 'default';
    return crypto.pbkdf2Sync(
      this.masterKey,
      Buffer.concat([salt, Buffer.from(context)]),
      100000,
      this.keyLength,
      'sha512',
    );
  }
}