import { Body, CacheInterceptor, CacheTTL, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './../services/app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Claims, Roles, RolesClaims } from "./../../../decorators/roles.decorator";
import { LanguageInfo } from "./../../../decorators/language-info.decorator";
import { END_POINT } from './../../../schema/common/models/constants/end-point.const';
import { NotificationSendToAllRQ } from '../models/dtos/notification-send-to-al-rq.dto';
import { CheckOut } from './../../common/models/classes/check-out.class';
import { NoStrict } from './../../../decorators/no-strict.decorator';
import { Configuration } from '../models/dtos/configuration.dto';
import * as Enum_Role from './../../user/models/enums/role.enum';
import * as Entity_Role from './../../user/entities/role.entity';
import { SetCacheRQ } from '../models/dtos/set-cache-rq.dto';

// TODO: REMOVE DEMO METHODS OR DISABLE ON PRODUCT MODE

@Controller('app')
@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get('ping')
  ping(): String {
    return this.appService.ping();
  }

  @Get('configuration')
  async configuration(): Promise<Configuration> {
    return await this.appService.configuration();
  }

  @ApiBearerAuth()
  @Roles(Enum_Role.Role.PROGRAMMER, Enum_Role.Role.ADMIN)
  @Get('guardByRole')
  guardByRole(): string {
    return this.appService.justAdminMethod();
  }

  @ApiBearerAuth()
  @RolesClaims({roles: [Enum_Role.Role.ADMIN], claims: [END_POINT.user.login.POST, END_POINT.app.info.GET]})
  @Get('guardByRoleAndClaim')
  guardByRoleAndClaim(): string {
    return this.appService.justAdminMethod();
  }  

  @ApiBearerAuth()
  @Claims(END_POINT.user.login.POST, END_POINT.app.info.GET)
  @Get('guardByClaim')
  guardByClaim(): string {
    return this.appService.justAdminMethod();
  }    

  @NoStrict()
  @Get('tellMeHello')
  async tellMeHello(
    @LanguageInfo() languageInfo: string,
  ): Promise<string> {
    return this.appService.tellMeHello(languageInfo);
  }

  @NoStrict()
  @Get('info')
  async getInfo(): Promise<string> {
    return await this.appService.getInfo();
  }

  @NoStrict()
  @Post('setCache')
  async setCache(@Body() setCacheRQ: SetCacheRQ,): Promise<string> {
    return await this.appService.setCache(setCacheRQ.key, setCacheRQ.value);
  }

  @NoStrict()
  @Get('getCache/:key')
  async getCache(@Param('key') key: string): Promise<string> {
    return await this.appService.getCache(key);
  }

  // not global cache
  // @UseInterceptors(CacheInterceptor)
  // not global ttl
  @CacheTTL(20)
  @NoStrict()
  @Get('cacheTest')
  async cacheTest(): Promise<any> {
    return await this.appService.cacheTest();
  }

  @ApiBearerAuth()
  @Roles(Enum_Role.Role.PROGRAMMER, Enum_Role.Role.ADMIN)
  @Post('notification/sendToAll')
  async notificationSendToAll( 
    @Body() notificationSendToAllRQ: NotificationSendToAllRQ,     
  ): Promise<CheckOut> {
    return await this.appService.notificationSendToAll(notificationSendToAllRQ);
  }   
}
