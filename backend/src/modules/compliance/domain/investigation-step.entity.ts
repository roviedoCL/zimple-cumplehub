import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Investigation } from './investigation.entity';

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  SKIPPED = 'skipped',
}

@Entity({ schema: 'shared', name: 'investigation_steps' })
@Index(['investigationId'])
@Index(['status'])
export class InvestigationStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  investigationId: string;

  @ManyToOne(() => Investigation, investigation => investigation.steps)
  @JoinColumn({ name: 'investigationId' })
  investigation: Investigation;

  @Column({ type: 'smallint' })
  order: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: StepStatus,
    default: StepStatus.PENDING,
  })
  status: StepStatus;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  evidence: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}