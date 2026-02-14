import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './application/tenant.service';
import { TenantRepository } from './infrastructure/tenant.repository';
import { TenantController } from './interface/tenant.controller';
import { Tenant } from './domain/tenant.entity';
import { TenantPlan } from './domain/tenant-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, TenantPlan])],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  exports: [TenantService, TenantRepository],
})
export class TenantModule {}