import { HttpException, HttpStatus } from '@nestjs/common';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ParsedException {
  status: number;
  message: string;
  errors: ValidationError[];
}

export function parseException(exception: unknown) {
  if (exception instanceof HttpException) {
    const res = exception.getResponse();
    const status = exception.getStatus();

    if (typeof res === 'object' && res !== null) {
      const response = res as { message?: string; errors?: any[] };
      return {
        status,
        message: response.message || 'Validation failed',
        errors: response.errors || [],
      };
    }

    return {
      status,
      message: res,
      errors: [],
    };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    errors: [],
  };
}
