import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { PaymentCallbackDto } from '@libs/payment/payment.types';

@ApiTags('Subscriptions')
@ApiBearerAuth('access-token')
@Controller('subscriptions')
@UseGuards(AccessTokenGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}


  @Get()
  @ApiOperation({ 
    summary: 'Get current user subscription',
    description: 'Retrieves the subscription details for the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current user subscription',
    type: SubscriptionResponseDto,
    examples: {
      example1: {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          plan_id: '123e4567-e89b-12d3-a456-426614174000',
          start_date: '2024-03-20T00:00:00Z',
          end_date: '2024-04-20T00:00:00Z',
          is_active: true,
          payment_status: 'PAID',
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T10:00:00Z'
        },
        summary: 'Current user subscription details'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No subscription found for the current user',
    examples: {
      example1: {
        value: {
          statusCode: 404,
          message: 'User subscription not found',
          error: 'Not Found'
        },
        summary: 'No subscription found'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing access token',
    examples: {
      example1: {
        value: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized'
        },
        summary: 'Unauthorized access'
      }
    }
  })
  findCurrentUser(@Request() req) {
    return this.subscriptionService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get subscription by id',
    description: 'Retrieves a specific subscription by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the subscription to retrieve',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the requested subscription',
    type: SubscriptionResponseDto,
    examples: {
      example1: {
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          plan_id: '123e4567-e89b-12d3-a456-426614174000',
          start_date: '2024-03-20T00:00:00Z',
          end_date: '2024-04-20T00:00:00Z',
          is_active: true,
          payment_status: 'PAID',
          created_at: '2024-03-20T10:00:00Z',
          updated_at: '2024-03-20T10:00:00Z'
        },
        summary: 'Subscription details'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Subscription not found',
    examples: {
      example1: {
        value: {
          statusCode: 404,
          message: 'Subscription not found',
          error: 'Not Found'
        },
        summary: 'Subscription not found'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing access token',
    examples: {
      example1: {
        value: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized'
        },
        summary: 'Unauthorized access'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(id);
  }

  
  @Post('payment')
  @ApiOperation({ 
    summary: 'Create payment for subscription',
    description: 'Creates a payment link for subscribing to a membership plan'
  })
  @ApiBody({ 
    type: CreatePaymentDto,
    description: 'Payment creation data including plan ID',
    examples: {
      example1: {
        value: {
          plan_id: '123e4567-e89b-12d3-a456-426614174000'
        },
        summary: 'Basic payment creation'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment link created successfully',
    examples: {
      example1: {
        value: {
          bin: '970400',
          accountNumber: '1234567890',
          accountName: 'NGUYEN VAN A',
          amount: 100000,
          description: 'Subscription to Premium Plan',
          orderCode: 1234567890,
          qrCode: 'https://api-merchant.payos.vn/v2/payment-requests/1234567890/qr-code',
          checkoutUrl: 'https://api-merchant.payos.vn/v2/payment-requests/1234567890/checkout'
        },
        summary: 'Payment link details'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'User already has an active subscription or invalid input data'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Membership plan not found'
  })
  createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.subscriptionService.createPayment(req.user.id, createPaymentDto.plan_id);
  }

  @Post('payment/callback')
  @ApiOperation({ 
    summary: 'Handle payment callback',
    description: 'Handles the callback from PayOS after payment completion'
  })
  @ApiBody({ 
    description: 'Payment callback data',
    examples: {
      example1: {
        value: {
          orderCode: 1234567890,
          status: 'PAID',
          checksum: 'abc123def456...'
        },
        summary: 'Payment callback data'
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment callback handled successfully',
    examples: {
      example1: {
        value: {
          success: true
        },
        summary: 'Payment processed successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid payment verification',
    examples: {
      example1: {
        value: {
          statusCode: 400,
          message: 'Invalid payment verification',
          error: 'Bad Request'
        },
        summary: 'Invalid payment'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pending subscription not found',
    examples: {
      example1: {
        value: {
          statusCode: 404,
          message: 'Pending subscription not found',
          error: 'Not Found'
        },
        summary: 'Subscription not found'
      }
    }
  })
  handlePaymentCallback(@Body() data: PaymentCallbackDto) {
    return this.subscriptionService.handlePaymentCallback(
      data.orderCode,
      data.status,
      data.checksum
    );
  }
} 