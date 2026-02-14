import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TenantPlan } from './tenant-plan.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

@Entity({ schema: 'shared' })
@Index(['subdomain'], { unique: true })
@Index(['rut'], { unique: true })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  subdomain: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  rut: string; // Chilean tax ID

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.PENDING,
  })
  status: TenantStatus;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => TenantPlan, { eager: true })
  @JoinColumn({ name: 'planId' })
  plan: TenantPlan;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    features: string[];
    limits: {
      maxUsers: number;
      maxSurveys: number;
      maxStorage: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  billingInfo: {
    contactName: string;
    contactEmail: string;
    billingAddress: string;
    paymentMethod: string;
    billingCycle: 'monthly' | 'yearly';
  };

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string;

  // Helper methods
  isActive(): boolean {
    return this.status === TenantStatus.ACTIVE;
  }

  isInTrial(): boolean {
    if (!this.trialEndsAt) return false;
    return new Date() < this.trialEndsAt;
  }

  hasFeature(feature: string): boolean {
    return this.settings?.features?.includes(feature) ?? false;
  }
}