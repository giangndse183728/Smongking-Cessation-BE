import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const user = client.data.user;
    
    if (user && user.sub) {
      return {
        id: user.sub,
        email: user.email,
        role: user.role
      };
    }
    
    return user;
  },
); 