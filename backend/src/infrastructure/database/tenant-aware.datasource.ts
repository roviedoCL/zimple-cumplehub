import { Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityManager, Repository, ObjectLiteral } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';

interface TenantContext {
  tenantId: string;
  schema: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantAwareDataSource {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  constructor(private readonly dataSource: DataSource) {}

  runWithTenant<T>(tenantId: string, callback: () => T): T {
    const schema = `tenant_${tenantId}`;
    return this.asyncLocalStorage.run({ tenantId, schema }, callback);
  }

  getCurrentTenant(): TenantContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getManager(): EntityManager {
    const tenant = this.getCurrentTenant();
    if (!tenant) {
      return this.dataSource.manager;
    }

    // Create a query runner with the tenant schema
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.query(`SET search_path TO ${tenant.schema}, shared;`);
    
    return queryRunner.manager;
  }

  getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
    const manager = this.getManager();
    return manager.getRepository(entity);
  }

  async createTenantSchema(tenantId: string): Promise<void> {
    const schema = `tenant_${tenantId}`;
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
      
      // Grant permissions
      await queryRunner.query(`
        GRANT USAGE ON SCHEMA ${schema} TO CURRENT_USER;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schema} TO CURRENT_USER;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ${schema} TO CURRENT_USER;
      `);
      
      // Run migrations for tenant schema
      await this.runTenantMigrations(schema, queryRunner);
      
    } finally {
      await queryRunner.release();
    }
  }

  private async runTenantMigrations(schema: string, queryRunner: any): Promise<void> {
    // Set search path for migrations
    await queryRunner.query(`SET search_path TO ${schema}, shared;`);
    
    // Create tenant-specific tables
    // This would typically run TypeORM migrations
    // For now, we'll just ensure the schema exists
  }
}