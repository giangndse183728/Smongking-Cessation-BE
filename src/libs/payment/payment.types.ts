export interface PaymentLinkResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  qrCode: string;
  checkoutUrl: string;
}

export interface PaymentCallbackDto {
  orderCode: number;
  status: string;
  checksum: string;
} 