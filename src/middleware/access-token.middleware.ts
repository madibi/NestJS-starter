import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { SecurityService } from "./../schema/user/services/security.service";
import { RequestExtended } from "./../schema/common/models/interfaces/request-extended.interface";

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {

  constructor(
      private readonly securityService: SecurityService
      ) {}

  async use(req: RequestExtended, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
        req.accessTokenPayload = null;
        next();
    } else {
      const authorization =  token.replace('Bearer ','');
      const response = this.securityService.decodeJwt(authorization);
      if (response.status) {
        req.accessTokenPayload = response.object;
        next();
      } else {
        // throw new HttpException(response.message, response.httpStatus);
        req.accessTokenPayload = null;
        next();
      }
    }
  }
}