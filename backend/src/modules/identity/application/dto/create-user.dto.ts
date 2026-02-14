import { IsString, IsEmail, IsOptional, IsEnum, Length, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../domain/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'First name', example: 'Juan' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Pérez' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'juan.perez@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'SecurePass123!' })
  @IsString()
  @Length(8, 100)
  password: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+56912345678' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'RUT (Chilean tax ID)', example: '12.345.678-9' })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: UserGender })
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @ApiPropertyOptional({ description: 'Birth date', example: '1990-01-15' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ description: 'Job title', example: 'Analista de RRHH' })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Recursos Humanos' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Hire date', example: '2020-03-01' })
  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}