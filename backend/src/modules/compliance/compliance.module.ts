import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { ComplaintService } from './application/complaint.service';
import { InvestigationService } from './application/investigation.service';
import { ComplaintRepository } from './infrastructure/complaint.repository';
import { InvestigationRepository } from './infrastructure/investigation.repository';
import { ComplaintController } from './interface/complaint.controller';
import { InvestigationController } from './interface/investigation.controller';

import { Complaint } from './domain/complaint.entity';
import { Investigation } from './domain/investigation.entity';
import { ComplaintAttachment } from './domain/complaint-attachment.entity';
import { InvestigationStep } from './domain/investigation-step.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Complaint,
      Investigation,
      ComplaintAttachment,
      InvestigationStep,
    ]),
    BullModule.registerQueue({
      name: 'compliance-notifications',
    }),
  ],
  controllers: [ComplaintController, InvestigationController],
  providers: [
    ComplaintService,
    InvestigationService,
    ComplaintRepository,
    InvestigationRepository,
  ],
  exports: [ComplaintService, InvestigationService],
})
export class ComplianceModule {}