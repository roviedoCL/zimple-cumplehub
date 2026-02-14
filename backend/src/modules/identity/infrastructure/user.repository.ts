import { Injectable } from '@nestjs/common';
import { Repository, DataSource, IsNull } from 'typeorm';
import { User, UserStatus } from '../domain/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findActiveByTenant(tenantId: string): Promise<User[]> {
    return this.find({
      where: {
        tenantId,
        status: UserStatus.ACTIVE,
        deletedAt: IsNull(),
      },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findByEmailWithRoles(email: string, tenantId: string): Promise<User | null> {
    return this.findOne({
      where: { email, tenantId, deletedAt: IsNull() },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async existsByEmail(email: string, tenantId: string): Promise<boolean> {
    const count = await this.count({
      where: { email, tenantId, deletedAt: IsNull() },
    });
    return count > 0;
  }
}