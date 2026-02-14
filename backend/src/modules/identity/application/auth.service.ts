import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { EncryptionService } from '@infrastructure/encryption/encryption.service';
import { User, UserStatus } from '../domain/user.entity';
import { LoginDto } from './dto/login.dto';

interface TokenPayload {
  sub: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash'>;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string): Promise<AuthResponse> {
    const { email, password, tenantId } = loginDto;

    // Find user
    const user = await this.userService.findByEmail(email, tenantId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new ForbiddenException('Account is not active');
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new ForbiddenException('Account is temporarily locked. Please try again later.');
    }

    // Verify password
    const isPasswordValid = this.encryptionService.verifyHash(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.userService.incrementFailedAttempts(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userService.updateLastLogin(user.id, ipAddress);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as User,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userService.findOne(payload.sub, payload.tenantId);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        ...tokens,
        user: userWithoutPassword as User,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // Invalidate refresh token
    await this.userService.update(userId, { refreshToken: null } as any, '');
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles?.map(r => r.name) || [],
      permissions: user.roles?.flatMap(r => r.permissions?.map(p => p.code)) || [],
    };

    const accessToken = this.jwtService.sign(payload);
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    // Store refresh token
    await this.userService.update(user.id, { refreshToken } as any, user.tenantId);

    const expiresIn = this.configService.get('jwt.expiresIn');
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 86400; // Default 24 hours

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 1);
  }
}