import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private readonly TOKEN_SECRET = process.env.TOKEN_SECRET;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user: User = await this.jwtService.verifyAsync(token, {
        secret: this.TOKEN_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const payload = {
        id: user.id,
        roleId: user.roleId,
        username: user.username,
        email: user.email,
        role: String(user.role),
      };

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    let [type, token] = request.headers.authorization?.split(' ') ?? [];

    let tokenFromCookie: string;
    if (request.cookies && request.cookies.access_token) {
      tokenFromCookie = request.cookies.access_token;
    }
    return type === 'Bearer' ? token : tokenFromCookie;
  }
}
