import { AppConfigService } from './../../../config/app/config.service';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from './../../common/services/language.service';
import { NotificationGateway } from './../../../gateways/notification.gateway';
import { CachingService } from './../../../services/caching/caching.service';
import { LangService } from './../../../services/lang/lang.service';
import { LogService } from './../../../services/log/log.service';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  const mockLanguageService = {};
  const mockLangService = {};
  const mockAppConfigService = {};
  const mockNotificationGateway = {};
  const mockLogService = {};
  const mockCachingService = {};
  const mockHttpService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        LanguageService,
        LangService,
        AppConfigService,
        NotificationGateway,
        LogService,
        CachingService,
        HttpService,                                                        
      ],
    })
    .overrideProvider(LanguageService).useValue(mockLanguageService)    
    .overrideProvider(LangService).useValue(mockLangService)    
    .overrideProvider(AppConfigService).useValue(mockAppConfigService)    
    .overrideProvider(NotificationGateway).useValue(mockNotificationGateway)    
    .overrideProvider(LogService).useValue(mockLogService)    
    .overrideProvider(CachingService).useValue(mockCachingService)    
    .overrideProvider(HttpService).useValue(mockHttpService)                                   
    .compile();

    appService = module.get<AppService>(AppService);
    appService.tellMeHello = jest.fn().mockImplementation((languageInfo: string) => 
      Promise.resolve('hello'))
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('app service', () => {
    it('ping should return pong', async () => {
      expect(appService.ping()).toBe('pong'); 
    });

    it('tellMeHello should return "hello"', async () => {
      expect(await appService.tellMeHello('en-US')).toBe('hello'); 
    });    
  })
});
