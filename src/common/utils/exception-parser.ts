import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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

export function parseException(exception: unknown): ParsedException {
  // Prisma error
  if (exception instanceof PrismaClientKnownRequestError) {
    if (exception.code === 'P2002') {
      const targetFields = (exception.meta as any)?.target ?? [];
      return {
        status: HttpStatus.CONFLICT,
        message: 'Duplicate field value violates unique constraint.',
        errors: targetFields.map((field: string) => ({
          path: field,
          message: `Duplicate value for field '${field}'`,
        })),
      };
    }
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const res = exception.getResponse();
    let message = exception.message || 'Internal server error';
    let errors: ValidationError[] = [];

    if (typeof res === 'object' && res !== null) {
      if (Array.isArray(res)) {
        errors = res;
        message = 'Unprocessable Entity Exception';
      } else if (Array.isArray((res as any).message)) {
        errors = (res as any).message;
        message = (res as any).error || 'Validation Failed';
      } else if (typeof (res as any).message === 'string') {
        message = (res as any).message;
      }
    }

    return { status, message, errors };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    errors: [],
  };
}
