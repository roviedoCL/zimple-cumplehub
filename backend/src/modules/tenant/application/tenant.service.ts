import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Tenant, TenantStatus } from '../domain/tenant.entity';
import { TenantPlan } from '../domain/tenant-plan.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantPlan)
    private readonly planRepository: Repository<TenantPlan>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if subdomain already exists
    const existingSubdomain = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain },
    });
    if (existingSubdomain) {
      throw new ConflictException('Subdomain already exists');
    }

    // Check if RUT already exists
    const existingRut = await this.tenantRepository.findOne({
      where: { rut: createTenantDto.rut },
    });
    if (existingRut) {
      throw new ConflictException('RUT already registered');
    }

    // Get default plan
    const defaultPlan = await this.planRepository.findOne({
      where: { type: 'basic', isActive: true },
    });
    if (!defaultPlan) {
      throw new NotFoundException('Default plan not found');
    }

    // Create tenant
    const tenant = this.tenantRepository.create({
      ...createTenantDto,
      planId: defaultPlan.id,
      status: TenantStatus.PENDING,
      settings: {
        timezone: 'America/Santiago',
        language: 'es',
        currency: 'CLP',
        dateFormat: 'DD/MM/YYYY',
        features: defaultPlan.features,
        limits: defaultPlan.limits,
      },
    });

    return this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      relations: ['plan'],
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['plan'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain, deletedAt: IsNull() },
      relations: ['plan'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // Check subdomain uniqueness if being updated
    if (updateTenantDto.subdomain && updateTenantDto.subdomain !== tenant.subdomain) {
      const existing = await this.tenantRepository.findOne({
        where: { subdomain: updateTenantDto.subdomain },
      });
      if (existing) {
        throw new ConflictException('Subdomain already exists');
      }
    }

    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const tenant = await this.findOne(id);
    tenant.deletedBy = deletedBy;
    await this.tenantRepository.softRemove(tenant);
  }

  async activate(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.status = TenantStatus.ACTIVE;
    return this.tenantRepository.save(tenant);
  }

  async suspend(id: string, reason?: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.status = TenantStatus.SUSPENDED;
    // Could store suspension reason in metadata
    return this.tenantRepository.save(tenant);
  }

  async getPlans(): Promise<TenantPlan[]> {
    return this.planRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }
}