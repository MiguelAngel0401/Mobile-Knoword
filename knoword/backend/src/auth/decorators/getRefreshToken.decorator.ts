import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetRefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    // Accede a la cookie usando bracket notation porque el nombre contiene un guion.
    return request.cookies?.['refresh-token'];
  },
);
