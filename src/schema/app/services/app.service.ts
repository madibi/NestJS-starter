import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { CheckOut } from './../../common/models/classes/check-out.class';
import { NotificationGateway } from './../../../gateways/notification.gateway';
import { NotificationSendToAllRQ } from '../models/dtos/notification-send-to-al-rq.dto';
import { AppConfigService } from './../../../config/app/config.service';
import { langKeys, LangService } from './../../../services/lang/lang.service';
import { Configuration } from '../models/dtos/configuration.dto';
import { AppDirection, Language } from './../../common/entities/language.entity';
import { LogService } from './../../../services/log/log.service';
import { CachingService } from './../../../services/caching/caching.service';
import { LanguageService } from './../../common/services/language.service';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {

  constructor(
    private readonly languageService: LanguageService,
    private readonly langService: LangService,
    private readonly appConfigService: AppConfigService,
    private readonly notificationGateway: NotificationGateway,
    private readonly logService: LogService,
    private readonly cachingService: CachingService,
    private readonly httpService: HttpService,
  ) { }

  ping(): string {
    return 'pong';
  }

  async configuration(): Promise<Configuration> {
    const configuration = new Configuration();
    // TODO: get current target country id by ip location
    configuration.language = new Language({
      id: 1,
      name: 'english',
      languageCode: 'en',
      languageLocale: 'US',
      phonePrefix: '+1',
      flagUrl: '',
      direction: AppDirection.LTR,
      dateType: 'gregorian'
    });
    return configuration;
  }

  justAdminMethod(): string {
    this.logService.info('this ts a log test');
    return 'log created';
  }

  async tellMeHello(languageInfo: string): Promise<string> {
    const translate = await this.langService.translate(langKeys.app.tellMeHello, languageInfo);
    return translate.message;
  }

  logSomething(): string {
    return 'you have admin role';
  }

  async getInfo(): Promise<string> {
    const uptime = await this.cachingService.get('SERVER_UPTIME');
    return `app version is: ${this.appConfigService.version}, and server up time is ${uptime}`;
  }

  async setCache(key: string, value: any): Promise<any> {
    return await this.cachingService.set(key, value, 3600);
  }  

  async getCache(key: string): Promise<string> {
    return await this.cachingService.get(key);
  }

  async cacheTest(): Promise<any> {
    return this.httpService.get('https://api.spacexdata.com/v3/rockets').pipe(
      map((response: AxiosResponse<any>) => {
        // console.log(response);
        return response.data;
      })
    );
  }

  async notificationSendToAll(notificationSendToAllRQ: NotificationSendToAllRQ): Promise<CheckOut> {
    this.notificationGateway.sendToAll(notificationSendToAllRQ.message);
    return new CheckOut();
  }
}
