import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PermissionCategory {
  USER = 'user',
  TENANT = 'tenant',
  COMPLIANCE = 'compliance',
  SURVEY = 'survey',
  ANALYTICS = 'analytics',
  REPORT = 'report',
  SETTINGS = 'settings',
  INTEGRATION = 'integration',
}

@Entity({ schema: 'shared' })
@Index(['code'], { unique: true })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PermissionCategory,
    default: PermissionCategory.USER,
  })
  category: PermissionCategory;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}