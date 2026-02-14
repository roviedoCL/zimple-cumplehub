import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Role } from './role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

@Entity({ schema: 'shared' })
@Index(['email'], { unique: true })
@Index(['tenantId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  lastLoginIp: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ type: 'smallint', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rut: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true,
  })
  gender: UserGender;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jobTitle: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    employeeId?: string;
    managerId?: string;
    costCenter?: string;
    location?: string;
    customFields?: Record<string, unknown>;
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    schema: 'shared',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string;

  // Helper methods
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  hasRole(roleName: string): boolean {
    return this.roles?.some(role => role.name === roleName) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this.roles?.some(role => 
      role.permissions?.some(p => p.code === permission)
    ) ?? false;
  }
}