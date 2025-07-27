import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { MembershipPlanRepository } from './membership-plan.repository';
import { MembershipPlanResponseDto } from './dto/membership-plan-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';

@Injectable()
export class MembershipPlanService {
  constructor(private membershipPlanRepository: MembershipPlanRepository) {}

  async create(data: CreateMembershipPlanDto): Promise<MembershipPlanResponseDto> {
    try {
      const existingPlan = await this.membershipPlanRepository.findByName(data.name);
      if (existingPlan) {
        throw new BadRequestException('A plan with this name already exists');
      }

      const plan = await this.membershipPlanRepository.create({
        ...data,
        is_active: data.is_active ?? true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      try {
        const transformedPlan = plainToInstance(MembershipPlanResponseDto, plan, {
          excludeExtraneousValues: true,
        });
        return transformedPlan;
      } catch (transformError) {
        throw new InternalServerErrorException(`Error processing membership plan data: ${transformError.message}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create membership plan: ${error.message}`);
    }
  }

  async findAll(): Promise<MembershipPlanResponseDto[]> {
    try {
      const plans = await this.membershipPlanRepository.findAll();
      
      try {
        const transformedPlans = plans.map(plan => 
          plainToInstance(MembershipPlanResponseDto, plan, {
            excludeExtraneousValues: true,
          })
        );
        return transformedPlans;
      } catch (transformError) {
        throw new InternalServerErrorException(`Error processing membership plans data: ${transformError.message}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch membership plans: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<MembershipPlanResponseDto> {
    try {
      const plan = await this.membershipPlanRepository.findById(id);
      if (!plan) {
        throw new NotFoundException('Membership plan not found');
      }
      
      try {
        const transformedPlan = plainToInstance(MembershipPlanResponseDto, plan, {
          excludeExtraneousValues: true,
        });
        return transformedPlan;
      } catch (transformError) {
        throw new InternalServerErrorException(`Error processing membership plan data: ${transformError.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch membership plan: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateMembershipPlanDto): Promise<MembershipPlanResponseDto> {
    try {
      const plan = await this.membershipPlanRepository.findById(id);
      if (!plan) {
        throw new NotFoundException('Membership plan not found');
      }

      if (data.name) {
        const existingPlan = await this.membershipPlanRepository.findByName(data.name);
        if (existingPlan && existingPlan.id !== id) {
          throw new BadRequestException('A plan with this name already exists');
        }
      }

      const updatedPlan = await this.membershipPlanRepository.update(id, {
        ...data,
        updated_at: new Date()
      });
      
      try {
        const transformedPlan = plainToInstance(MembershipPlanResponseDto, updatedPlan, {
          excludeExtraneousValues: true,
        });
        return transformedPlan;
      } catch (transformError) {
        throw new InternalServerErrorException(`Error processing updated membership plan data: ${transformError.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update membership plan: ${error.message}`);
    }
  }

  async delete(id: string): Promise<MembershipPlanResponseDto> {
    try {
      const plan = await this.membershipPlanRepository.findById(id);
      if (!plan) {
        throw new NotFoundException('Membership plan not found');
      }

      const deletedPlan = await this.membershipPlanRepository.softDelete(id);
      
      try {
        const transformedPlan = plainToInstance(MembershipPlanResponseDto, deletedPlan, {
          excludeExtraneousValues: true,
        });
        return transformedPlan;
      } catch (transformError) {
        throw new InternalServerErrorException(`Error processing deleted membership plan data: ${transformError.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete membership plan: ${error.message}`);
    }
  }
} 