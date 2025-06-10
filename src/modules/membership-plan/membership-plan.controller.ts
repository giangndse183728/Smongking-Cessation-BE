import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlanResponseDto } from './dto/membership-plan-response.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Membership Plans')
@ApiBearerAuth('access-token')
@Controller('membership-plans')
@UseGuards(AccessTokenGuard, RolesGuard)
export class MembershipPlanController {
  constructor(private readonly membershipPlanService: MembershipPlanService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Create a new membership plan',
    description: 'Creates a new membership plan with specified features and pricing (Admin only)'
  })
  @ApiBody({ 
    type: CreateMembershipPlanDto,
    description: 'Membership plan creation data including name, features, and pricing',
    examples: {
      'Create Premium Plan': {
        value: {
          name: 'Premium Plan',
          description: 'Access to all premium features',
          price: 29.99,
          duration_days: 30,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Membership plan created successfully',
    type: MembershipPlanResponseDto,
    examples: {
      'Created Plan': {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Premium Plan',
          description: 'Access to all premium features',
          price: 29.99,
          duration_days: 30,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics'],
          is_active: true,
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T10:00:00Z'
        },
        summary: 'Successfully created membership plan'
      }
    }
  })
  create(@Body() createMembershipPlanDto: CreateMembershipPlanDto) {
    return this.membershipPlanService.create(createMembershipPlanDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all membership plans',
    description: 'Retrieves a list of all active membership plans'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of all membership plans',
    type: [MembershipPlanResponseDto],
    examples: {
      'List of Plans': {
        value: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Premium Plan',
            description: 'Access to all premium features',
            price: 29.99,
            duration_days: 30,
            features: ['Unlimited access', 'Priority support', 'Advanced analytics'],
            is_active: true,
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-03-20T10:00:00Z'
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Basic Plan',
            description: 'Essential features for beginners',
            price: 9.99,
            duration_days: 30,
            features: ['Basic access', 'Email support'],
            is_active: true,
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-03-20T10:00:00Z'
          }
        ],
        summary: 'List of all active membership plans'
      }
    }
  })
  findAll() {
    return this.membershipPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get membership plan by id',
    description: 'Retrieves a specific membership plan by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the membership plan to retrieve',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the requested membership plan',
    type: MembershipPlanResponseDto,
    examples: {
      'Plan Details': {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Premium Plan',
          description: 'Access to all premium features',
          price: 29.99,
          duration_days: 30,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics'],
          is_active: true,
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T10:00:00Z'
        },
        summary: 'Membership plan details'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.membershipPlanService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update membership plan',
    description: 'Updates an existing membership plan with new data (Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the membership plan to update',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    type: UpdateMembershipPlanDto,
    description: 'Updated membership plan data',
    examples: {
      'Update Plan': {
        value: {
          price: 39.99,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics', 'Custom reports']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Membership plan updated successfully',
    type: MembershipPlanResponseDto,
    examples: {
      'Updated Plan': {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Premium Plan',
          description: 'Access to all premium features',
          price: 39.99,
          duration_days: 30,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics', 'Custom reports'],
          is_active: true,
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T11:00:00Z'
        },
        summary: 'Successfully updated membership plan'
      }
    }
  })
  update(
    @Param('id') id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ) {
    return this.membershipPlanService.update(id, updateMembershipPlanDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Delete membership plan',
    description: 'Soft deletes a membership plan by its ID (Admin only)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the membership plan to delete',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Membership plan deleted successfully',
    type: MembershipPlanResponseDto,
    examples: {
      'Deleted Plan': {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Premium Plan',
          description: 'Access to all premium features',
          price: 29.99,
          duration_days: 30,
          features: ['Unlimited access', 'Priority support', 'Advanced analytics'],
          is_active: false,
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T12:00:00Z'
        },
        summary: 'Successfully deleted membership plan'
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.membershipPlanService.delete(id);
  }
} 