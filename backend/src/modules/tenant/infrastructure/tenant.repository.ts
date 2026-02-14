import { Injectable } from '@nestjs/common';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Tenant, TenantStatus } from '../domain/tenant.entity';

@Injectable()
export class TenantRepository extends Repository<Tenant> {
  constructor(private dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }

  async findActiveTenants(): Promise<Tenant[]> {
    return this.find({
      where: {
        status: TenantStatus.ACTIVE,
        deletedAt: IsNull(),
      },
      relations: ['plan'],
    });
  }

  async findByRut(rut: string): Promise<Tenant | null> {
    return this.findOne({
      where: { rut, deletedAt: IsNull() },
    });
  }

  async existsBySubdomain(subdomain: string): Promise<boolean> {
    const count = await this.count({
      where: { subdomain, deletedAt: IsNull() },
    });
    return count > 0;
  }
}