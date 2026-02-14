import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Complaint } from './complaint.entity';
import { InvestigationStep } from './investigation-step.entity';

export enum InvestigationStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  AWAITING_INFO = 'awaiting_info',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended',
}

export enum InvestigationOutcome {
  SUBSTANTIATED = 'substantiated',
  UNSUBSTANTIATED = 'unsubstantiated',
  INCONCLUSIVE = 'inconclusive',
  WITHDRAWN = 'withdrawn',
}

@Entity({ schema: 'shared' })
@Index(['tenantId'])
@Index(['complaintId'])
@Index(['status'])
export class Investigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  complaintId: string;

  @ManyToOne(() => Complaint, complaint => complaint.investigations)
  @JoinColumn({ name: 'complaintId' })
  complaint: Complaint;

  @Column({ type: 'varchar', length: 50 })
  caseNumber: string;

  @Column({
    type: 'enum',
    enum: InvestigationStatus,
    default: InvestigationStatus.PLANNED,
  })
  status: InvestigationStatus;

  @Column({ type: 'uuid' })
  leadInvestigatorId: string;

  @Column({ type: 'simple-json', nullable: true })
  teamMembers: string[];

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  methodology: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  targetEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({
    type: 'enum',
    enum: InvestigationOutcome,
    nullable: true,
  })
  outcome: InvestigationOutcome;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'simple-json', nullable: true })
  correctiveActions: {
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
  }[];

  @Column({ type: 'boolean', default: false })
  hasGenderPerspective: boolean;

  @Column({ type: 'text', nullable: true })
  genderAnalysis: string;

  @Column({ type: 'boolean', default: false })
  involvesPowerImbalance: boolean;

  @Column({ type: 'simple-json', nullable: true })
  interviews: {
    personId: string;
    date: Date;
    type: 'complainant' | 'respondent' | 'witness' | 'expert';
    notes: string;
    conductedBy: string;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  evidence: {
    type: string;
    description: string;
    collectedBy: string;
    collectedAt: Date;
    fileUrl?: string;
  }[];

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  @OneToMany(() => InvestigationStep, step => step.investigation)
  steps: InvestigationStep[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  deletedBy: string;

  // Helper methods
  isOverdue(): boolean {
    if (!this.targetEndDate || this.actualEndDate) return false;
    return new Date() > this.targetEndDate;
  }

  getProgress(): number {
    if (!this.steps || this.steps.length === 0) return 0;
    const completedSteps = this.steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / this.steps.length) * 100);
  }
}