import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { users } from '@prisma/client';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!data) {
      return request.user as users;
    }
    return (request.user as users)[data as keyof users];
  },
);
