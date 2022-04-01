import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from './../schema/user/models/classes/access-token-payload.class';
  
  export const TokenInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
      const req = ctx.switchToHttp().getRequest();
      const accessTokenPayload = req.accessTokenPayload;
      if (!accessTokenPayload) {
        return null;
      }
      return accessTokenPayload;
    },
  );
