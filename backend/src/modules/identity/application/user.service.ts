import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User, UserStatus } from '../domain/user.entity';
import { Role } from '../domain/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptionService } from '@infrastructure/encryption/encryption.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto, tenantId: string): Promise<User> {
    // Check if email already exists for this tenant
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email, tenantId },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered for this tenant');
    }

    // Hash password
    const passwordHash = this.encryptionService.hash(createUserDto.password);

    // Get default role
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'employee', tenantId },
    });

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      tenantId,
      passwordHash,
      status: UserStatus.PENDING,
      roles: defaultRole ? [defaultRole] : [],
      preferences: {
        language: 'es',
        timezone: 'America/Santiago',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        theme: 'system',
      },
    });

    return this.userRepository.save(user);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId, deletedAt: IsNull() },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, tenantId, deletedAt: IsNull() },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<User> {
    const user = await this.findOne(id, tenantId);

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateUserDto.email, tenantId },
      });
      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password if being updated
    if (updateUserDto.password) {
      (updateUserDto as any).passwordHash = this.encryptionService.hash(updateUserDto.password);
      delete (updateUserDto as any).password;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string, tenantId: string, deletedBy: string): Promise<void> {
    const user = await this.findOne(id, tenantId);
    user.deletedBy = deletedBy;
    await this.userRepository.softRemove(user);
  }

  async activate(id: string, tenantId: string): Promise<User> {
    const user = await this.findOne(id, tenantId);
    user.status = UserStatus.ACTIVE;
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    return this.userRepository.save(user);
  }

  async updateLastLogin(id: string, ip: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      user.failedLoginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      
      await this.userRepository.save(user);
    }
  }

  async assignRole(userId: string, roleId: string, tenantId: string): Promise<User> {
    const user = await this.findOne(userId, tenantId);
    const role = await this.roleRepository.findOne({
      where: { id: roleId, tenantId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (!user.roles) {
      user.roles = [];
    }

    if (!user.roles.some(r => r.id === roleId)) {
      user.roles.push(role);
      await this.userRepository.save(user);
    }

    return user;
  }

  async removeRole(userId: string, roleId: string, tenantId: string): Promise<User> {
    const user = await this.findOne(userId, tenantId);
    user.roles = user.roles.filter(r => r.id !== roleId);
    return this.userRepository.save(user);
  }
}