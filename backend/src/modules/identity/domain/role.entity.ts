import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Permission } from './permission.entity';

export enum SystemRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  HR_MANAGER = 'hr_manager',
  EMPLOYEE = 'employee',
  ANONYMOUS = 'anonymous',
}

@Entity({ schema: 'shared' })
@Index(['name', 'tenantId'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'smallint', default: 0 })
  hierarchyLevel: number;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    schema: 'shared',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}