import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

@Entity({ schema: 'shared', name: 'tenant_plans' })
export class TenantPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.BASIC,
  })
  type: PlanType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  yearlyPrice: number;

  @Column({ type: 'jsonb' })
  features: string[];

  @Column({ type: 'jsonb' })
  limits: {
    maxUsers: number;
    maxSurveys: number;
    maxResponsesPerSurvey: number;
    maxStorageGB: number;
    maxAdmins: number;
    apiCallsPerMonth: number;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'smallint', default: 0 })
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}