import { IsEmail, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email address', example: 'juan.perez@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'SecurePass123!' })
  @IsString()
  @Length(8, 100)
  password: string;

  @ApiProperty({ description: 'Tenant ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  tenantId: string;
}