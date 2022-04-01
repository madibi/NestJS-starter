import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestHeaderInfo } from './../schema/common/models/classes/request-header-info.class';
  
  export const HeaderInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): RequestHeaderInfo => {
      const req = ctx.switchToHttp().getRequest();
      const headerInfo = req.headerInfo;
      if (!headerInfo) {
        return null;
      }
      return headerInfo;
    },
  );
