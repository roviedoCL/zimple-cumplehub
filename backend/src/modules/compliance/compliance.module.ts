import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComplaintService } from './application/complaint.service';

import { Complaint } from './domain/complaint.entity';
import { Investigation } from './domain/investigation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Complaint,
      Investigation,
    ]),
  ],
  controllers: [],
  providers: [
    ComplaintService,
  ],
  exports: [ComplaintService],
})
export class ComplianceModule {}