import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserModule } from './../src/schema/user/user.module';
import { UserService } from './../src/schema/user/services/user.service';
import { RequestCodeType } from './../src/schema/user/models/enums/request-code-type.enum';
import { RequestCodeRQ } from './../src/schema/user/models/dtos/request-code-rq.dto';
import { RequestCodeSmsType } from './../src/schema/user/models/enums/request-code-sms-type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './../src/schema/user/repositories/user.repository';
import { UserAvatarRepository } from './../src/schema/user/repositories/user-avatar.repository';
import { ImageRepository } from './../src/schema/common/repositories/image.repository';
import { IPRepository } from './../src/schema/common/repositories/ip.repository';
import { LanguageRepository } from './../src/schema/common/repositories/language.repository';
import { LangService } from './../src/services/lang/lang.service';
import { SmsRepository } from './../src/schema/log/repositories/sms.repository';
import { TokenRepository } from './../src/schema/log/repositories/token.repository';
import { LogService } from './../src/services/log/log.service';
import { IPService } from './../src/schema/common/services/ip.service';
import { SmsService } from './../src/schema/log/services/sms.service';
import { SecurityService } from './../src/schema/user/services/security.service';
import { CachingService } from './../src/services/caching/caching.service';
import { CheckOutObject } from './../src/schema/common/models/classes/check-out-object.class';
import { Translate } from './../src/schema/common/models/classes/translate.class';
import { HttpService } from '@nestjs/axios';
import { I18nService } from 'nestjs-i18n';
import * as request from 'supertest';
import { string } from 'joi';

describe('AuthController (e2e)', () => {
  jest.setTimeout(60000);
  let auth: INestApplication;

  const mockUserRepository = {};
  const mockUserAvatarRepository = {};
  const mockImageRepository = {};
  const mockIPRepository = {
    find: jest.fn(),
    // find: jest.fn().mockImplementation(() => Promise.resolve({})),
    // find: jest.fn().mockResolvedValue({}),
  };  
  const mockLanguageRepository = {};  
  const mockSmsRepository = {};
  const mockTokenRepository = {};
  const mockRequestCodeRQ: RequestCodeRQ = {
    type: RequestCodeType.MOBILE,
    smsType: RequestCodeSmsType.APP,
    phonePrefix: '+98',
    mobileNumber: '9393401050',
  };

  const mockHttpService = {};  
  const mockUserService = {}; 
  const mockLangService = {
    setKeyToValue: jest.fn(),
    translate: jest.fn((k, i) => {
      let translate = new Translate();
      translate.code = 'TRANSLATE_MOCK_CODE';
      translate.message = 'TRANSLATE_MOCK_MESSAGE';
      return translate;
    }),
  };  
  const mockLogService = {};  
  const mockIPService = {}; 
  const mockSmsService = {
    findSMSes: jest.fn((data: any) => {
      return [];
    }),
    sendSmsByApp: jest.fn((data: any) => {
      return new CheckOutObject<null>();
    }),
  }; 
  const mockSecurityService = {};  
  const mockCachingService = {};        

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [
        UserRepository,
        UserAvatarRepository,
        ImageRepository,
        IPRepository,
        LanguageRepository,
        SmsRepository,
        TokenRepository,

        HttpService,
        SmsService,
        UserService,
        LangService,
        LogService,
        IPService,
        SmsService,
        SecurityService,
        CachingService,
      ]
    })
    .overrideProvider(getRepositoryToken(UserRepository))
    .useValue(mockUserRepository)
    .overrideProvider(getRepositoryToken(UserAvatarRepository))
    .useValue(mockUserAvatarRepository)
    .overrideProvider(getRepositoryToken(ImageRepository))
    .useValue(mockImageRepository)    
    .overrideProvider(getRepositoryToken(IPRepository))
    .useValue(mockIPRepository)
    .overrideProvider(getRepositoryToken(LanguageRepository))
    .useValue(mockLanguageRepository)    
    .overrideProvider(getRepositoryToken(SmsRepository))
    .useValue(mockSmsRepository)    
    .overrideProvider(getRepositoryToken(TokenRepository))
    .useValue(mockTokenRepository)    

    .overrideProvider(HttpService)
    .useValue(mockHttpService)      
    // .overrideProvider(UserService)
    // .useValue(mockUserService)   
    .overrideProvider(LangService)
    .useValue(mockLangService)  
    .overrideProvider(LogService)
    .useValue(mockLogService)    
    .overrideProvider(IPService)
    .useValue(mockIPService)
    .overrideProvider(SmsService)
    .useValue(mockSmsService)   
    .overrideProvider(SecurityService)
    .useValue(mockSecurityService)    
    .overrideProvider(CachingService)
    .useValue(mockCachingService)            

    .compile();

    auth = testingModule.createNestApplication();
    await auth.init();
  });

  it('/auth/requestCode (POST)', async () => {
    return request
      .default(auth.getHttpServer())
      .post('/auth/requestCode')
      .send(mockRequestCodeRQ) 
      .expect(201) 
      .then((response) => { 
        expect(response.body).toEqual({          
          message: expect.any(String),
          messageCode: expect.any(String), 
          sessionInfo: null
        })      
      });
  });  
});
