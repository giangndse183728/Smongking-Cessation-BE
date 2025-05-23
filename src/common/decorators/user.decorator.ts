import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { users } from '@prisma/client';

export const GetCurrentUser = createParamDecorator(
  (data: keyof users, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: users }>();
    if (!data) return request.user;
    return request.user[data];
  },
);
