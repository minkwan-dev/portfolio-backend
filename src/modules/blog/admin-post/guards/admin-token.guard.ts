import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = process.env.ADMIN_API_TOKEN;

    if (!expected) {
      throw new UnauthorizedException('Admin token is not configured');
    }

    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : null;

    if (!token || token !== expected) {
      throw new UnauthorizedException('Invalid admin token');
    }

    return true;
  }
}
