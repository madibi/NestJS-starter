import { Body, Controller, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { Request } from 'express';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { RequestCodeRQ } from "../models/dtos/request-code-rq.dto";
import { RequestCodeRS } from "../models/dtos/request-code-rs.dto";
import { RequestCodeSmsType } from "../models/enums/request-code-sms-type.enum";
import { VerifyCodeRQ } from "../models/dtos/verify-code-rq.dto";
import { VerifyCodeRS } from "../models/dtos/verify-code-rs.dto";
import { UserService } from "./../services/user.service";
import { NoStrict } from "./../../../decorators/no-strict.decorator";
import { langKeys, LangService } from "./../../../services/lang/lang.service";
import { LanguageInfo } from "./../../../decorators/language-info.decorator";
import { RefreshTokenRQ } from "../models/dtos/refresh-token-rq.dto";
import { Token } from "../models/dtos/token.dto";

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {

  constructor(
    private userService: UserService,
    private langService: LangService,
  ) { }

  @NoStrict()
  @Post('requestCode')
  async requestCode(
    @Body() requestCodeRQ: RequestCodeRQ,
    @LanguageInfo() languageInfo: string
  ): Promise<RequestCodeRS> {
    const requestCodeRS = new RequestCodeRS();
    let { checkOutObject, code } = await this.userService.requestCode(requestCodeRQ, languageInfo);
    const testCode =
      (process.env.APP_ENV === 'development' && requestCodeRQ.smsType == RequestCodeSmsType.APP) ? `,${code}` : '';
    if (!checkOutObject.status) {
      throw new HttpException(checkOutObject.message, HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      const translate = await this.langService.translate(langKeys.user.requestCode.SMS_SENT, languageInfo);
      requestCodeRS.message = translate.message + testCode;
      requestCodeRS.messageCode = translate.code;
      requestCodeRS.sessionInfo = checkOutObject.object ? checkOutObject.object.sessionInfo : null;
      return requestCodeRS;
    }
  }

  @ApiExcludeEndpoint()
  @NoStrict()
  @Post('verifyCode')
  async verifyCode(
    @Body() verifyCodeRQ: VerifyCodeRQ,
    @Req() request: Request,
    @LanguageInfo() languageInfo: string
  ): Promise<VerifyCodeRS> {
    const verifyCodeRS = new VerifyCodeRS();
    const checkOutObject = await this.userService.verifyCode(verifyCodeRQ, request, languageInfo);
    if (!checkOutObject.status) {
      throw new HttpException(checkOutObject.message, HttpStatus.BAD_REQUEST);
    } else {
      verifyCodeRS.token = checkOutObject.object;
      return verifyCodeRS;
    }
  }

  @ApiExcludeEndpoint()      
  @Post('refreshToken')
  async refreshToken(
    @Body() refreshTokenRQ: RefreshTokenRQ,
    @Req() request: Request,
    @LanguageInfo() languageInfo: string    
  ): Promise<Token> {
    let res = this.userService.refreshToken(refreshTokenRQ, request);
    if((await res).status) {
      return (await res).object;
    } else {
      throw new HttpException('problem in refreshing token', HttpStatus.BAD_REQUEST);
    }
  }      
}