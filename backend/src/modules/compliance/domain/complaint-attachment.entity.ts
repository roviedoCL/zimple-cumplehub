import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Complaint } from './complaint.entity';

export enum AttachmentType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  OTHER = 'other',
}

@Entity({ schema: 'shared', name: 'complaint_attachments' })
@Index(['complaintId'])
export class ComplaintAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  complaintId: string;

  @ManyToOne(() => Complaint, complaint => complaint.attachments)
  @JoinColumn({ name: 'complaintId' })
  complaint: Complaint;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    default: AttachmentType.OTHER,
  })
  type: AttachmentType;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 64 })
  fileHash: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isConfidential: boolean;

  @Column({ type: 'uuid' })
  uploadedBy: string;

  @CreateDateColumn()
  uploadedAt: Date;
}