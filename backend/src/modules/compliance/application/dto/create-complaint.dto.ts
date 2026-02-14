import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsObject, IsArray, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplaintType, ComplaintChannel, ComplainantType } from '../../domain/complaint.entity';

export class CreateComplaintDto {
  @ApiProperty({ enum: ComplaintType, description: 'Type of complaint' })
  @IsEnum(ComplaintType)
  type: ComplaintType;

  @ApiPropertyOptional({ enum: ComplaintChannel, description: 'Channel through which complaint was received' })
  @IsEnum(ComplaintChannel)
  @IsOptional()
  channel?: ComplaintChannel;

  @ApiProperty({ enum: ComplainantType, description: 'Type of complainant' })
  @IsEnum(ComplainantType)
  complainantType: ComplainantType;

  @ApiPropertyOptional({ description: 'Whether the complaint is anonymous' })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ description: 'Complainant name' })
  @IsString()
  @IsOptional()
  complainantName?: string;

  @ApiPropertyOptional({ description: 'Complainant email' })
  @IsString()
  @IsOptional()
  complainantEmail?: string;

  @ApiPropertyOptional({ description: 'Complainant phone' })
  @IsString()
  @IsOptional()
  complainantPhone?: string;

  @ApiProperty({ description: 'Description of the incident' })
  @IsString()
  @Length(10, 5000)
  description: string;

  @ApiPropertyOptional({ description: 'Additional details' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ description: 'Date of incident' })
  @IsDateString()
  @IsOptional()
  incidentDate?: string;

  @ApiPropertyOptional({ description: 'Location of incident' })
  @IsString()
  @IsOptional()
  incidentLocation?: string;

  @ApiPropertyOptional({ description: 'Involved parties' })
  @IsArray()
  @IsOptional()
  involvedParties?: {
    name: string;
    role: string;
    relationship: string;
    isEmployee: boolean;
  }[];

  @ApiPropertyOptional({ description: 'Witnesses' })
  @IsArray()
  @IsOptional()
  witnesses?: {
    name: string;
    contact: string;
    relationship: string;
  }[];
}