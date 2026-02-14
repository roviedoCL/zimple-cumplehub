import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';

@Injectable()
export class TenantRepository extends Repository<Tenant> {
  constructor(private dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }

  async findActiveTenants(): Promise<Tenant[]> {
    return this.find({
      where: {
        status: 'active',
        deletedAt: null,
      },
      relations: ['plan'],
    });
  }

  async findByRut(rut: string): Promise<Tenant | null> {
    return this.findOne({
      where: { rut, deletedAt: null },
    });
  }

  async existsBySubdomain(subdomain: string): Promise<boolean> {
    const count = await this.count({
      where: { subdomain, deletedAt: null },
    });
    return count > 0;
  }
}