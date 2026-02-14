import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from '../application/tenant.service';
import { CreateTenantDto } from '../application/dto/create-tenant.dto';
import { UpdateTenantDto } from '../application/dto/update-tenant.dto';
import { Tenant } from '../domain/tenant.entity';
import { TenantPlan } from '../domain/tenant-plan.entity';

@ApiTags('Tenants')
@Controller('tenants')
@ApiBearerAuth('JWT-auth')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully', type: Tenant })
  @ApiResponse({ status: 409, description: 'Subdomain or RUT already exists' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: 200, description: 'List of all tenants', type: [Tenant] })
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available tenant plans' })
  @ApiResponse({ status: 200, description: 'List of available plans', type: [TenantPlan] })
  async getPlans(): Promise<TenantPlan[]> {
    return this.tenantService.getPlans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tenant> {
    return this.tenantService.findOne(id);
  }

  @Get('by-subdomain/:subdomain')
  @ApiOperation({ summary: 'Get tenant by subdomain' })
  @ApiResponse({ status: 200, description: 'Tenant found', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findBySubdomain(@Param('subdomain') subdomain: string): Promise<Tenant> {
    return this.tenantService.findBySubdomain(subdomain);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Subdomain already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant (soft delete)' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    // TODO: Get user ID from JWT token
    const deletedBy = 'system';
    return this.tenantService.remove(id, deletedBy);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<Tenant> {
    return this.tenantService.activate(id);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend tenant' })
  @ApiResponse({ status: 200, description: 'Tenant suspended successfully', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async suspend(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('reason') reason?: string,
  ): Promise<Tenant> {
    return this.tenantService.suspend(id, reason);
  }
}