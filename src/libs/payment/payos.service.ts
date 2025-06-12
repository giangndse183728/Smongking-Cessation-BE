// payos.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as crypto from 'crypto';
import { PaymentLinkResponse, PaymentCallbackDto } from './payment.types';

interface PaymentRequestData {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

@Injectable()
export class PayOsService {
  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly checksumKey: string;
  private readonly endpoint = 'https://api-merchant.payos.vn';

  constructor() {
    if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
      throw new Error('PayOS configuration is missing. Please check your environment variables.');
    }

    this.clientId = process.env.PAYOS_CLIENT_ID!;
    this.apiKey = process.env.PAYOS_API_KEY!;
    this.checksumKey = process.env.PAYOS_CHECKSUM_KEY!;
  }

  private validatePaymentData(data: PaymentRequestData): void {
    if (!data.orderCode) {
      throw new BadRequestException('Invalid order code');
    }
    if (!data.amount || data.amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    if (!data.description) {
      throw new BadRequestException('Description is required');
    }
    if (!data.returnUrl) {
      throw new BadRequestException('Return URL is required');
    }
    if (!data.cancelUrl) {
      throw new BadRequestException('Cancel URL is required');
    }
  }

  private generateChecksum(data: Record<string, any>): string {
    // Create signature string in exact format required by PayOS
    const signatureData = [
      `amount=${data.amount}`,
      `cancelUrl=${data.cancelUrl}`,
      `description=${data.description}`,
      `orderCode=${data.orderCode}`,
      `returnUrl=${data.returnUrl}`
    ].join('&');

    return crypto
      .createHmac('sha256', this.checksumKey)
      .update(signatureData)
      .digest('hex');
  }

  

  async createPaymentLink(data: PaymentRequestData): Promise<PaymentLinkResponse> {
    try {
      // Validate input data
      this.validatePaymentData(data);

      const payload = {
        ...data,
        clientId: this.clientId,
      };
      const signature = this.generateChecksum(payload);
      payload['signature'] = signature;

      const response = await axios.post<PaymentLinkResponse>(
        `${this.endpoint}/v2/payment-requests`,
        
        payload, 
        {
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data) {
        throw new InternalServerErrorException('No response data from PayOS');
      }

      return response.data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('PayOS API error:', {
          status: error.response?.status,
          message: errorMessage,
          data: error.response?.data,
        });
        throw new BadRequestException(`Failed to create payment link: ${errorMessage}`);
      }
      throw new InternalServerErrorException('Failed to create payment link');
    }
  }

  async verifyPayment(data: PaymentCallbackDto): Promise<boolean> {
    try {
      if (!data.orderCode || !data.status ) {
        throw new BadRequestException('Missing required payment verification data');
      }

      const response = await axios.get(
        `${this.endpoint}/v2/payment-requests/${data.orderCode}`,
        {
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );


      if (!response.data || !response.data.data) {
        throw new InternalServerErrorException('No response data from PayOS verification');
      }

      const isValid = response.data.data.status === 'PAID' && data.status === 'PAID';

      return isValid;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
      
        throw new BadRequestException(`Failed to verify payment: ${errorMessage}`);
      }

      throw new InternalServerErrorException('Failed to verify payment');
    }
  }
}
