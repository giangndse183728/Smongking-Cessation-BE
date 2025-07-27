import { Controller, Get, HttpStatus } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('')
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get leaderboard Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          relapse_free_streak: [
            {
              id: 'ed54bf6c-6338-4e2a-8ff0-18b83fe75570',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_type: 'relapse_free_streak',
              rank: 1,
              score: 1,
              created_at: '2025-06-20T10:06:30.641Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:41:40.914Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
            {
              id: '674fb684-1ade-4d99-b245-afa09b5f6313',
              user_id: '1ba24541-e41e-4279-895e-989a5cc1d873',
              achievement_type: 'relapse_free_streak',
              rank: 1,
              score: 1,
              created_at: '2025-06-23T09:31:31.332Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:46:20.673Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
          ],
          abstinence_days: [
            {
              id: 'd4ea065d-db70-426d-8c63-b43544867cd4',
              user_id: '1ba24541-e41e-4279-895e-989a5cc1d873',
              achievement_type: 'abstinence_days',
              rank: 1,
              score: 1,
              created_at: '2025-06-23T09:31:31.395Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:46:20.730Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
            {
              id: 'ddaccad4-bdf2-417b-98fe-60432605d987',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_type: 'abstinence_days',
              rank: 1,
              score: 1,
              created_at: '2025-06-20T10:06:30.705Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:46:20.974Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
          ],
          money_saved: [
            {
              id: '9418d15b-7adb-413c-9840-18236bc58b50',
              user_id: '1ba24541-e41e-4279-895e-989a5cc1d873',
              achievement_type: 'money_saved',
              rank: 1,
              score: 5,
              created_at: '2025-06-23T09:31:31.425Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:46:20.785Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
            {
              id: '26d4d5a6-9722-4877-a558-ed1aeeff0635',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_type: 'money_saved',
              rank: 1,
              score: 13,
              created_at: '2025-06-20T10:06:30.765Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:46:21.048Z',
              updated_by: null,
              deleted_at: null,
              deleted_by: null,
            },
          ],
        },
        timestamp: '2025-06-23T09:46:22.218Z',
      },
    },
  })
  async getLeaderboards() {
    return await this.leaderboardService.getLeaderBoards();
  }
}
