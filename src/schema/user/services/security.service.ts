import { HttpStatus, Injectable } from "@nestjs/common";
import { Request } from 'express';
import { AccessTokenPayload } from "./../models/classes/access-token-payload.class";
import { Token } from "../models/dtos/token.dto";
import { UserInfo } from "../models/dtos/user-info.dto";
import { UserPrivate } from "../models/dtos/user-private.dto";
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from "../models/classes/refresh-token-payload.class";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../repositories/user.repository";
import { UserAvatar } from "../entities/user-avatar.entity";
import { plainToClass } from "class-transformer";
import { ImageProcessorService } from './../../../services/image-processor/image-processor.service';
import { UserAgentInfo } from "../models/interfaces/user-agent-info.interface";
import { CheckOutObject } from "./../../common/models/classes/check-out-object.class";
import { AccessTokenPayloadUserAgent } from "../models/classes/access-token-payload.-user-agent.class";
import { EndPoint } from "./../../common/entities/end-point.entity";
import { EndPointGroup } from "./../../common/entities/end-point-group.entity";
import { CachingService } from "./../../../services/caching/caching.service";
import { TokenService } from "./../../log/services/token.service";
import { v4 as uuidV4 } from 'uuid';
import * as Entity_Role from './../entities/role.entity';
import * as Enum_Role from './../models/enums/role.enum';
import * as Entity_Image from './../../../schema/common/entities/image.entity';
const requestIp = require('request-ip');
var parser = require('ua-parser-js');

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly imageProcessorService: ImageProcessorService,
    private readonly jwtService: JwtService,
    private readonly cachingService: CachingService,
  ) { }

  public async prepareToken(userId: string, request: Request): Promise<Token> {
    const accessTokenExpiresIn = process.env.TOKEN_ACCESS_TOKEN_EXPIRATION;
    const refreshTokenExpiresIn = process.env.TOKEN_REFRESH_TOKEN_EXPIRATION;
    let userInfo: UserInfo<UserPrivate, Enum_Role.Role> = await this.getUserInfo(userId);

    const clientIp = requestIp.getClientIp(request);
    const appId = uuidV4();
    const userAgentInfo = this.userAgent(request);
    const accessTokenPayloadUserAgent = new AccessTokenPayloadUserAgent();
    accessTokenPayloadUserAgent.browseName = userAgentInfo.browser.name;
    accessTokenPayloadUserAgent.osName = userAgentInfo.os.name;
    accessTokenPayloadUserAgent.cpuArchitecture = userAgentInfo.cpu.architecture;

    const base64Claims = this.convertClaimsToBase64(userInfo.claims);
    const accessTokenPayload = {
      userId: userId,
      roles: userInfo.roles,
      claims: base64Claims,
      userAgent: accessTokenPayloadUserAgent,
      clientIp,
      appId
    } as AccessTokenPayload;
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: accessTokenExpiresIn,
    });
    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTokenExpiresIn,
    });

    await this.tokenService.create(
      userId,
      clientIp,
      userAgentInfo.browser.name,
      userAgentInfo.os.name,
      userAgentInfo.cpu.architecture,
      appId,
    );

    await this.cachingService.setUniqueToken(userId, appId);

    return new Token({
      userInfo,
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
      appId,
    });
  }

  public decodeJwt(token: string): CheckOutObject<AccessTokenPayload> {
    const checkOutObject = new CheckOutObject<AccessTokenPayload>();
    let accessTokenPayload = new AccessTokenPayload();

    try {
      const info = this.jwtService.verify(token);
      accessTokenPayload.roles = info.roles;
      accessTokenPayload.claims = info.claims ? this.convertClaimsFromBase64(info.claims) : undefined;
      accessTokenPayload.userId = info.userId;
      accessTokenPayload.userAgent = info.userAgent;
      accessTokenPayload.clientIp = info.clientIp;
      checkOutObject.object = accessTokenPayload;
    } catch (err) {
      checkOutObject.status = false;
      checkOutObject.message = err.message;
      checkOutObject.httpStatus = HttpStatus.UNAUTHORIZED;
      // 'invalid token' - the header or payload could not be parsed
      // 'jwt malformed' - the token does not have three components (delimited by a .)
      // 'jwt signature is required'
      // 'invalid signature'
      // 'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
      // 'jwt issuer invalid. expected: [OPTIONS ISSUER]'
      // 'jwt id invalid. expected: [OPTIONS JWT ID]'
      // 'jwt subject invalid. expected: [OPTIONS SUBJECT]'      
    }

    return checkOutObject;
  }

  public userAgent(req: Request): UserAgentInfo {
    var userAgent = parser(req.headers['user-agent']);
    const userAgentInfo: UserAgentInfo = {
      ua: userAgent.ua,
      browser: userAgent.browser,
      engine: userAgent.engine,
      os: userAgent.os,
      device: userAgent.device,
      cpu: userAgent.cpu,
    };
    return userAgentInfo;
  }

  private async getUserInfo(userId: string): Promise<UserInfo<UserPrivate, Enum_Role.Role>> {
    let query = this.userRepository.createQueryBuilder('user');
    query.leftJoinAndSelect("user_roles_role", "user_roles", `user_roles."userId" = '${userId}'`);
    query.leftJoinAndSelect("user_claims_end_point", "user_claims", `"user_claims"."userId" = '${userId}'`);
    query.leftJoinAndSelect("user_claim_groups_end_point_group", "user_claim_groups", `"user_claim_groups"."userId" = '${userId}'`);
    query.leftJoinAndSelect(UserAvatar, "userAvatar", `"userAvatar"."userId" = '${userId}'`);
    query.leftJoinAndMapMany(
      'user._userRoles',
      Entity_Role.Role,
      'roles',
      'roles.id = user_roles."roleId"',
    );
    query.leftJoinAndMapMany(
      'user._userClaims',
      EndPoint,
      'claims',
      'claims.id = user_claims."endPointId"',
    );
    query.leftJoinAndMapMany(
      'user._userClaimGroups',
      EndPointGroup,
      'claimGroups',
      'claimGroups.id = user_claim_groups."endPointGroupId"',
    );    
    query.leftJoinAndMapOne(
      'user._userAvatar',
      Entity_Image.Image,
      'userAvatarImage',
      'userAvatarImage.id = "userAvatar"."imageId"',
    );
    query.where('user.id = :id', { id: userId })

    // console.log(query.getSql());    
    let res = await query.getOne() as any;

    const userRoles: Enum_Role.Role[] = this.convertEntityRoleToEnumRole(res._userRoles);
    const userClaims: number[] = res._userClaims.map(c => c.code);
    const userClaimGroups: number[] = res._userClaimGroups.map(cg => cg.id);    
    const userAvatar = this.imageProcessorService.getImageProperties(res._userAvatar);
    const userPrivate: UserPrivate = plainToClass(UserPrivate, res, {
      excludeExtraneousValues: true,
    });

    return new UserInfo<UserPrivate, Enum_Role.Role>({
      user: userPrivate,
      roles: userRoles,
      claims: userClaims,
      claimGroups: userClaimGroups,
      avatar: userAvatar,
    });
  }

  private convertEntityRoleToEnumRole(
    enumRoles: Entity_Role.Role[]
  ) {
    return enumRoles ? enumRoles.map((r) => {
      return Enum_Role.Role[r.key];
    }) : null;
  }

  private convertClaimsToBase64(claims: number[]): string {
    const sum = this.sumArrayOfNumbers(claims);
    const base64 = this.convertBase(sum.toString(), 10, 64);
    return base64;
  }

  private convertClaimsFromBase64(claims: string): number[] {
    const base10 = parseInt(this.convertBase(claims, 64, 10), 10);
    const arr = this.makeArrayNumberOfSumNumbers(base10);
    return arr;
  }

  private sumArrayOfNumbers(ar: number[]) {
    var sum = 0;
    for (var i = 0; i < ar.length; i++) {
      sum += Number(ar[i]);
    }
    return sum;
  }

  private makeArrayNumberOfSumNumbers(number: number):number[]{
    let arr = [];
    const steps:number[] = [16, 8, 4, 2, 1];
    let remain = number;
    steps.forEach(value => {
      if(remain >= value) {
        arr.push(value);
        remain = remain - value;
      }
    });
    return arr;
  }

  private convertBase(str, fromBase, toBase) {

    const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

    const add = (x, y, base) => {
      let z = [];
      const n = Math.max(x.length, y.length);
      let carry = 0;
      let i = 0;
      while (i < n || carry) {
        const xi = i < x.length ? x[i] : 0;
        const yi = i < y.length ? y[i] : 0;
        const zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
      }
      return z;
    }

    const multiplyByNumber = (num, x, base) => {
      if (num < 0) return null;
      if (num == 0) return [];

      let result = [];
      let power = x;
      while (true) {
        num & 1 && (result = add(result, power, base));
        num = num >> 1;
        if (num === 0) break;
        power = add(power, power, base);
      }

      return result;
    }

    const parseToDigitsArray = (str, base) => {
      const digits = str.split('');
      let arr = [];
      for (let i = digits.length - 1; i >= 0; i--) {
        const n = DIGITS.indexOf(digits[i])
        if (n == -1) return null;
        arr.push(n);
      }
      return arr;
    }

    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
      digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
      power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
      out += DIGITS[outArray[i]];

    return out;
  }
}