import { Injectable, NestMiddleware } from "@nestjs/common";
import { LanguageCode } from "./../schema/common/models/enums/language-code.enum";
import { LanguageLocale } from "./../schema/common/models/enums/language-locale.enum";
import { NextFunction } from "express";
import { RequestExtended } from "./../schema/common/models/interfaces/request-extended.interface";

@Injectable()
export class LanguageInfoMiddleware implements NestMiddleware {

  constructor() {}

  async use(req: RequestExtended, res: Response, next: NextFunction) {
    let languageCode = req.headers['languageCode'];
    let languageLocal = req.headers['languageCode'];    
    languageCode = languageCode ? languageCode : LanguageCode.en;
    languageLocal = languageLocal ? languageLocal : LanguageLocale.US;

    req.languageInfo = `${languageCode}-${languageLocal}`;
    next();
  }
}