import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Complaint, ComplaintStatus, ComplaintChannel, ComplainantType } from '../domain/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { EncryptionService } from '@infrastructure/encryption/encryption.service';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createComplaintDto: CreateComplaintDto, tenantId: string): Promise<Complaint> {
    // Generate case number
    const caseNumber = await this.generateCaseNumber(tenantId);

    // Generate access token for anonymous complaints
    let accessToken: string | undefined;
    if (createComplaintDto.isAnonymous) {
      accessToken = this.encryptionService.generateToken(32);
    }

    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      tenantId,
      caseNumber,
      accessToken,
      receivedAt: new Date(),
      status: ComplaintStatus.RECEIVED,
    });

    return this.complaintRepository.save(complaint);
  }

  async findAll(tenantId: string, filters?: {
    status?: ComplaintStatus;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Complaint[]> {
    const query = this.complaintRepository.createQueryBuilder('complaint')
      .where('complaint.tenantId = :tenantId', { tenantId })
      .andWhere('complaint.deletedAt IS NULL');

    if (filters?.status) {
      query.andWhere('complaint.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('complaint.type = :type', { type: filters.type });
    }

    if (filters?.startDate) {
      query.andWhere('complaint.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('complaint.createdAt <= :endDate', { endDate: filters.endDate });
    }

    return query.orderBy('complaint.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id, tenantId, deletedAt: IsNull() },
      relations: ['investigations', 'attachments'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    return complaint;
  }

  async findByCaseNumber(caseNumber: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { caseNumber, tenantId, deletedAt: IsNull() },
      relations: ['investigations', 'attachments'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with case number ${caseNumber} not found`);
    }

    return complaint;
  }

  async findByAccessToken(accessToken: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { accessToken, deletedAt: IsNull() },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    Object.assign(complaint, updateComplaintDto);
    return this.complaintRepository.save(complaint);
  }

  async assign(id: string, assignedTo: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    complaint.assignedTo = assignedTo;
    complaint.status = ComplaintStatus.UNDER_REVIEW;
    complaint.acknowledgedAt = new Date();
    return this.complaintRepository.save(complaint);
  }

  async startInvestigation(id: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    
    if (!complaint.canBeInvestigated()) {
      throw new ConflictException('Complaint cannot be investigated in current status');
    }

    complaint.status = ComplaintStatus.IN_INVESTIGATION;
    complaint.investigationStartedAt = new Date();
    return this.complaintRepository.save(complaint);
  }

  async resolve(id: string, resolution: string, actions: string[], tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    complaint.status = ComplaintStatus.RESOLVED;
    complaint.resolvedAt = new Date();
    complaint.resolution = resolution;
    complaint.resolutionActions = actions;
    return this.complaintRepository.save(complaint);
  }

  async close(id: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    complaint.status = ComplaintStatus.CLOSED;
    return this.complaintRepository.save(complaint);
  }

  async requestPsychologicalSupport(id: string, providerId: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    complaint.requiresPsychologicalSupport = true;
    complaint.psychologicalSupportProviderId = providerId;
    return this.complaintRepository.save(complaint);
  }

  async providePsychologicalSupport(id: string, tenantId: string): Promise<Complaint> {
    const complaint = await this.findOne(id, tenantId);
    complaint.psychologicalSupportProvidedAt = new Date();
    return this.complaintRepository.save(complaint);
  }

  async getStats(tenantId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byChannel: Record<string, number>;
    overdue: number;
    avgResolutionDays: number;
  }> {
    const complaints = await this.complaintRepository.find({
      where: { tenantId, deletedAt: IsNull() },
    });

    const stats = {
      total: complaints.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byChannel: {} as Record<string, number>,
      overdue: 0,
      avgResolutionDays: 0,
    };

    let totalResolutionDays = 0;
    let resolvedCount = 0;

    for (const complaint of complaints) {
      // Count by status
      stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
      
      // Count by type
      stats.byType[complaint.type] = (stats.byType[complaint.type] || 0) + 1;
      
      // Count by channel
      stats.byChannel[complaint.channel] = (stats.byChannel[complaint.channel] || 0) + 1;
      
      // Count overdue
      if (complaint.isOverdue()) {
        stats.overdue++;
      }

      // Calculate resolution time
      if (complaint.resolvedAt && complaint.receivedAt) {
        const days = Math.floor(
          (complaint.resolvedAt.getTime() - complaint.receivedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalResolutionDays += days;
        resolvedCount++;
      }
    }

    if (resolvedCount > 0) {
      stats.avgResolutionDays = Math.round(totalResolutionDays / resolvedCount);
    }

    return stats;
  }

  private async generateCaseNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = 'DEN';
    
    // Get count of complaints for this tenant in current year
    const count = await this.complaintRepository.count({
      where: {
        tenantId,
        createdAt: new Date(year, 0, 1),
      },
    });

    const sequence = (count + 1).toString().padStart(5, '0');
    return `${prefix}-${year}-${sequence}`;
  }
}