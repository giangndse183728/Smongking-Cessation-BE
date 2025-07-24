import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { PayOsService } from '@libs/payment/payos.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, PayOsService],
})
export class StatisticsModule {}