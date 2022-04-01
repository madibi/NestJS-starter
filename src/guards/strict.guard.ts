import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UserAgentInfo } from './../schema/user/models/interfaces/user-agent-info.interface';
import { CheckOut } from './../schema/common/models/classes/check-out.class';
import { SecurityService } from './../schema/user/services/security.service';
import { CheckOutObject } from './../schema/common/models/classes/check-out-object.class';
import { AccessTokenPayload } from './../schema/user/models/classes/access-token-payload.class';
import { AccessTokenPayloadUserAgent } from './../schema/user/models/classes/access-token-payload.-user-agent.class';
import { Reflector } from '@nestjs/core';
import { langKeys, LangService } from './../services/lang/lang.service';
import { IPService } from './../schema/common/services/ip.service';
import { AppConfigService } from './../config/app/config.service';
const requestIp = require('request-ip');

@Injectable()
export class StrictGuard implements CanActivate {

  languageInfo: string;  

  constructor(
    private readonly reflector: Reflector,
    private readonly securityService: SecurityService,
    private readonly langService: LangService,
    private readonly iPService: IPService,
    private readonly appConfigService: AppConfigService,
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isNoStrict = this.reflector.get<boolean>(
      'noStrict',
      context.getHandler()
    );
    if (isNoStrict) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    this.languageInfo = request.languageInfo;
    const browserAgentInfo = this.securityService.userAgent(request);
    const browserIp = requestIp.getClientIp(request);
    
    const checkAuthorization = await this.checkAuthorization(request.headers.authorization);
    if (!checkAuthorization.status) {
      throw new HttpException(checkAuthorization.message, checkAuthorization.httpStatus);
    } 

    if (this.appConfigService.checkIP) {
      const checkAllowedIP = await this.checkAllowedIP(browserIp);
      if (!checkAllowedIP.status) {
        throw new HttpException(checkAllowedIP.message, checkAllowedIP.httpStatus);
      } 
    }     

    if (this.appConfigService.checkUserIP) {
      const checkUserIP = await this.checkUserIP(checkAuthorization.object.clientIp, browserIp);
      if (!checkUserIP.status) {
        throw new HttpException(checkUserIP.message, checkUserIP.httpStatus);
      } 
    } 

    if (this.appConfigService.checkUserAgent) {
      const checkUserAgent = await this.checkUserAgent(checkAuthorization.object.userAgent, browserAgentInfo);
      if (!checkUserAgent.status) {
        throw new HttpException(checkUserAgent.message, checkUserAgent.httpStatus);
      } 
    } 

    return true;
  }

  private async checkAuthorization(authorization: any): Promise<CheckOutObject<AccessTokenPayload>> {
    let checkOutObject = new CheckOutObject<AccessTokenPayload> ();
    if(!authorization) {
      const translate = await this.langService.translate(langKeys.auth.NOT_LOGGED_IN, this.languageInfo);
    } else {
      const auth = authorization.replace('Bearer ','');
      const res = this.securityService.decodeJwt(auth);
      if(!res.status) {
        checkOutObject.status = false;
        checkOutObject.httpStatus = HttpStatus.UNAUTHORIZED;
        checkOutObject.message = res.message;
      } else {
        checkOutObject.object = res.object;
      }
    }
    return checkOutObject;
  }

  private async checkAllowedIP(ip: string): Promise<CheckOut>{
    let checkOut = new CheckOut();
    const isAllowedIP = this.iPService.isIPAllowed(ip);
    const isDisAllowedIP = this.iPService.isIPDisAllowed(ip);
    if (!isAllowedIP || isDisAllowedIP) {
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_USER_IP, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;    
    }   
    return checkOut;
  }

  private async checkUserIP(userIp: string, browserIp: string): Promise<CheckOut> {
    let checkOut = new CheckOut ();
    if(!browserIp) {
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_USER_IP, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    } else if (userIp !== browserIp) {
      const translate = await this.langService.translate(langKeys.auth.NOT_EQUAL_USER_IP, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
      }
      return checkOut;
  }  

  private async checkUserAgent(userAgentInfo: AccessTokenPayloadUserAgent, browserAgentInfo: UserAgentInfo): Promise<CheckOut> {
    let checkOut = new CheckOut ();
    if(!browserAgentInfo) {
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_USER_AGENT, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    } else if (
      userAgentInfo.browseName !== browserAgentInfo.browser.name ||
      userAgentInfo.osName !== browserAgentInfo.os.name ||
      userAgentInfo.cpuArchitecture !== browserAgentInfo.cpu.architecture
      ) {
        const translate = await this.langService.translate(langKeys.auth.NOT_EQUAL_USER_AGENT, this.languageInfo);
        checkOut.status = false;
        checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
        checkOut.message = translate.message;
        checkOut.messageCode = translate.code;
      }
      return checkOut;
  }
}