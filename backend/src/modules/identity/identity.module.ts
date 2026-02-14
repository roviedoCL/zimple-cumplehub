import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from './application/user.service';
import { AuthService } from './application/auth.service';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './interface/user.controller';
import { AuthController } from './interface/auth.controller';

import { User } from './domain/user.entity';
import { Role } from './domain/role.entity';
import { Permission } from './domain/permission.entity';

import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './interface/guards/jwt-auth.guard';
import { RolesGuard } from './interface/guards/roles.guard';
import { PermissionsGuard } from './interface/guards/permissions.guard';
import { TestUserSeed } from './infrastructure/seeds/test-user.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
          issuer: configService.get('jwt.issuer'),
          audience: configService.get('jwt.audience'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    TestUserSeed,
  ],
  exports: [
    UserService,
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class IdentityModule {}