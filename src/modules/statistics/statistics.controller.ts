import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';
import { RolesGuard } from '@common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';

@ApiTags('Statistics')
@ApiBearerAuth('access-token')
@Controller('statistics')
@UseGuards(AccessTokenGuard,RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(UserRole.ADMIN)
  @Get('overview')
  @ApiOperation({ summary: 'Get system statistics overview (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics overview',
    schema: {
      example: {
        totalUsers: 100,
        totalActiveQuitPlans: 20,
        totalCoaches: 5,
        totalMembers: 30,
        totalMoneySaved: 12345.67,
        totalCigarettesNotSmoked: 54321,
      },
    },
  })
  async getOverview() {
    return this.statisticsService.getOverview();
  }

  @Roles(UserRole.ADMIN)
  @Get('subscription-transactions')
  @ApiOperation({ summary: 'Get all subscription transactions (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all subscription transactions from the local database' })
  async getAllSubscriptionTransactions() {
    return this.statisticsService.getAllSubscriptionTransactions();
  }
} 