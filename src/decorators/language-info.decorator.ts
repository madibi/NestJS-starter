import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const LanguageInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    const languageInfo = req.languageInfo;
    return languageInfo;
  },
);
