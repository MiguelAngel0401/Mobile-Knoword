import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['access-token'];
  }
  return null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not found in environment variables');
    }
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: UserPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    // Passport adjuntará este payload a request.user
    return {
      sub: payload.sub,
    };
  }
}
