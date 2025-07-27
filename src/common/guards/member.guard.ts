import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class MemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.isMember) {
      throw new ForbiddenException('You must be a member to access this resource');
    }

    return true;
  }
}