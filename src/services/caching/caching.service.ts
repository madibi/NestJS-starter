import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { SmsSendingType } from "./../../schema/log/models/enums/sms-sending-type.enum";
import { AppConfigService } from "./../../config/app/config.service";
import { Cache} from 'cache-manager';

@Injectable()
export class CachingService {

  constructor(
    @Inject(CACHE_MANAGER) 
    private readonly cache: Cache,
    private readonly appConfigService: AppConfigService
  ) {
    cache.reset();
  }

  async set(key: string, value: any, ttl = 10000): Promise<string> {
    return await this.cache.set(key, value, { ttl });
  }  

  async get(key: string): Promise<string> {
    return await this.cache.get(key);
  }

  async setUniqueToken(userId: string, appId: string): Promise<string> {
    const ttl = this.appConfigService.accessTokenExpirationInMillisecond / 1000;
    return await this.cache.set(`UNIQUE_TOKEN_${userId}`, appId, { ttl });
  }  

  async getUniqueToken(userId: string): Promise<string> {
    return await this.cache.get(`UNIQUE_TOKEN_${userId}`);
  }  

  async setAuthSms(phonePrefix: string, mobileNumber: string, smsSendingType: SmsSendingType, code: string): Promise<string> { //[4, 2, 3].reduce((partialSum, a) => partialSum * a);
    const ttl = this.appConfigService.codeExpiration / 1000;
    return await this.cache.set(`AUTH_SMS_${phonePrefix}_${mobileNumber}_${SmsSendingType[smsSendingType]}`, code, { ttl });
  }  

  async getAuthSms(phonePrefix: string, mobileNumber: string, smsSendingType: SmsSendingType): Promise<string> {
    return await this.cache.get(`AUTH_SMS_${phonePrefix}_${mobileNumber}_${SmsSendingType[smsSendingType]}`);
  }    

  async del(key: any): Promise<string> {
    return await this.cache.del(key);
  }
}
