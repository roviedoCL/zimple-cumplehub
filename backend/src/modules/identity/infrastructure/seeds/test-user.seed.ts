import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../domain/user.entity';
import { Role } from '../../domain/role.entity';
import { EncryptionService } from '@infrastructure/encryption/encryption.service';

@Injectable()
export class TestUserSeed implements OnModuleInit {
  private readonly logger = new Logger(TestUserSeed.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async onModuleInit() {
    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    await this.seedTestUser();
  }

  private async seedTestUser() {
    const testEmail = 'test@zimple.com';
    const testPassword = 'TestPassword123!';

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: testEmail },
    });

    if (existingUser) {
      this.logger.log('Usuario de prueba ya existe');
      return;
    }

    // Crear rol de admin si no existe
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'tenant_admin' },
    });

    if (!adminRole) {
      adminRole = this.roleRepository.create({
        tenantId: '00000000-0000-0000-0000-000000000001',
        name: 'tenant_admin',
        description: 'Administrador del tenant',
      });
      await this.roleRepository.save(adminRole);
      this.logger.log('Rol tenant_admin creado');
    }

    // Crear usuario de prueba
    const passwordHash = this.encryptionService.hash(testPassword);
    
    const testUser = this.userRepository.create({
      tenantId: '00000000-0000-0000-0000-000000000001',
      firstName: 'Usuario',
      lastName: 'Prueba',
      email: testEmail,
      passwordHash,
      phone: '+56912345678',
      status: UserStatus.ACTIVE,
      emailVerified: true,
      rut: '12.345.678-9',
      jobTitle: 'Administrador',
      department: 'Sistemas',
      roles: [adminRole],
    });

    await this.userRepository.save(testUser);

    this.logger.log('=================================');
    this.logger.log('Usuario de prueba creado:');
    this.logger.log(`Email: ${testEmail}`);
    this.logger.log(`Password: ${testPassword}`);
    this.logger.log('=================================');
  }
}
