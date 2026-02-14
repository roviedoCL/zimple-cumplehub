import { IsString, IsOptional, IsEmail, Length, Matches, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ description: 'Company name', example: 'Empresa Demo SpA' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ description: 'Unique subdomain for the tenant', example: 'empresa-demo' })
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain: string;

  @ApiProperty({ description: 'Chilean RUT (tax ID)', example: '76.123.456-7' })
  @IsString()
  @Length(8, 12)
  rut: string;

  @ApiPropertyOptional({ description: 'Company logo URL' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Company description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Contact information' })
  @IsObject()
  @IsOptional()
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}