import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './../schema/user/models/enums/role.enum';
import { CLAIMS_KEY, RolesClaimsParams, ROLES_CLAIMS_KEY, ROLES_KEY } from './../decorators/roles.decorator';
import { SecurityService } from './../schema/user/services/security.service';
import { CheckOut } from './../schema/common/models/classes/check-out.class';
import { langKeys, LangService } from './../services/lang/lang.service';

@Injectable()
export class RolesClaimsGuard implements CanActivate {

  languageInfo: string;

  constructor(
    private reflector: Reflector,
    private securityService: SecurityService,
    private langService: LangService,
    ) {
    }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.languageInfo = request.languageInfo;
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredClaims = this.reflector.getAllAndOverride<number[]>(CLAIMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);    
    const requiredRolesClaims = this.reflector.getAllAndOverride<RolesClaimsParams[]>(ROLES_CLAIMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);        

    if (!requiredRoles && !requiredClaims && !requiredRolesClaims) {
      return true;
    }

    const authorization = await this.checkAuthorization(request.headers.authorization, requiredRoles, requiredClaims, requiredRolesClaims);
    if (authorization.status) {
      return true;
    } else {
      throw new HttpException(authorization.message, authorization.httpStatus);
    }    
  }
  
  private async checkAuthorization(authorization: any, requiredRoles: Role[], requiredClaims: number[], requiredRolesClaims: RolesClaimsParams[]): Promise<CheckOut>{
    let checkOut = new CheckOut();
    if(!authorization) {
      const translate = await this.langService.translate(langKeys.auth.NOT_LOGGED_IN, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    } else {
      const auth = authorization.replace('Bearer ','');
      const response = this.securityService.decodeJwt(auth);
      const roles = response.object.roles;
      const claims = response.object.claims as number[];
      if (response.status) {
        if (requiredRoles) {
          checkOut = await this.checkRoles(roles, requiredRoles);
        };
        if (requiredClaims) {
          checkOut = await this.checkClaims(claims, requiredClaims);
        }; 
        if (requiredRolesClaims) {
          checkOut = await this.checkRolesClaims(roles, requiredRoles, claims, requiredClaims);
        };                
      } else {
        checkOut.status = false;
        checkOut.httpStatus = response.httpStatus;
        checkOut.message = response.message;
      }    
    }    
    return checkOut;
  }

  private async checkRoles(roles: Role[], requiredRoles: any): Promise<CheckOut>{
    let checkOut = new CheckOut();
    if(!requiredRoles.some((role) => roles?.includes(role))){
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_ROLE, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    };
    return checkOut;
  }

  private async checkClaims(claims: number[], requiredClaims: any): Promise<CheckOut>{
    let checkOut = new CheckOut();
    if(!requiredClaims.some((claim) => claims?.includes(claim))){
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_CLAIM, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    };
    return checkOut;
  }  

  private async checkRolesClaims(roles: Role[], requiredRoles: any, claims: number[], requiredClaims: any): Promise<CheckOut>{
    let checkOut = new CheckOut();
    const isAnyRole = requiredRoles.some((role) => roles?.includes(role));
    const isAnyClaim = requiredClaims.some((claim) => claims?.includes(claim));
    if(!isAnyRole && !isAnyClaim){
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_ROLE_CLAIM, this.languageInfo);
      checkOut.status = false;
      checkOut.httpStatus = HttpStatus.UNAUTHORIZED;
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
    };
    return checkOut;
  }  
}