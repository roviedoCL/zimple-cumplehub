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
import { Investigation } from './investigation.entity';
import { ComplaintAttachment } from './complaint-attachment.entity';

export enum ComplaintType {
  HARASSMENT_SEXUAL = 'harassment_sexual',
  HARASSMENT_LABORAL = 'harassment_laboral',
  DISCRIMINATION = 'discrimination',
  VIOLENCIA_LABORAL = 'violencia_laboral',
  ACOSO_POLITICO = 'acoso_politico',
  RETALIATION = 'retaliation',
  OTHER = 'other',
}

export enum ComplaintChannel {
  WEB = 'web',
  EMAIL = 'email',
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
  IVR = 'ivr',
  IN_PERSON = 'in_person',
  THIRD_PARTY = 'third_party',
}

export enum ComplaintStatus {
  RECEIVED = 'received',
  UNDER_REVIEW = 'under_review',
  IN_INVESTIGATION = 'in_investigation',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum ComplainantType {
  VICTIM = 'victim',
  WITNESS = 'witness',
  THIRD_PARTY = 'third_party',
  ANONYMOUS = 'anonymous',
}

@Entity({ schema: 'shared' })
@Index(['tenantId'])
@Index(['caseNumber'], { unique: true })
@Index(['status'])
@Index(['createdAt'])
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  caseNumber: string;

  @Column({
    type: 'enum',
    enum: ComplaintType,
  })
  type: ComplaintType;

  @Column({
    type: 'enum',
    enum: ComplaintChannel,
    default: ComplaintChannel.WEB,
  })
  channel: ComplaintChannel;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.RECEIVED,
  })
  status: ComplaintStatus;

  @Column({
    type: 'enum',
    enum: ComplainantType,
    default: ComplainantType.VICTIM,
  })
  complainantType: ComplainantType;

  @Column({ type: 'boolean', default: false })
  isAnonymous: boolean;

  @Column({ type: 'uuid', nullable: true })
  complainantId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complainantName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complainantEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  complainantPhone: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'date', nullable: true })
  incidentDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  incidentLocation: string;

  @Column({ type: 'simple-json', nullable: true })
  involvedParties: {
    name: string;
    role: string;
    relationship: string;
    isEmployee: boolean;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  witnesses: {
    name: string;
    contact: string;
    relationship: string;
  }[];

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @Column({ type: 'uuid', nullable: true })
  assignedTeam: string;

  @Column({ type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  investigationStartedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  slaDeadline: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'text', nullable: true })
  resolution: string;

  @Column({ type: 'simple-json', nullable: true })
  resolutionActions: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  accessToken: string;

  @Column({ type: 'boolean', default: false })
  requiresPsychologicalSupport: boolean;

  @Column({ type: 'timestamp', nullable: true })
  psychologicalSupportProvidedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  psychologicalSupportProviderId: string;

  @OneToMany(() => Investigation, investigation => investigation.complaint)
  investigations: Investigation[];

  @OneToMany(() => ComplaintAttachment, attachment => attachment.complaint)
  attachments: ComplaintAttachment[];

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
    if (!this.slaDeadline) return false;
    return new Date() > this.slaDeadline;
  }

  canBeInvestigated(): boolean {
    return [
      ComplaintStatus.RECEIVED,
      ComplaintStatus.UNDER_REVIEW,
    ].includes(this.status);
  }

  getDaysSinceReceived(): number {
    if (!this.receivedAt) return 0;
    const diff = new Date().getTime() - this.receivedAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}