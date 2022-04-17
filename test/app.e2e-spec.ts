import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/schema/app/app.module';
import { AppService } from './../src/schema/app/services/app.service';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from './../src/config/app/config.module';
import { SwaggerConfigModule } from './../src/config/swagger/config.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { I18nModule } from 'nestjs-i18n';
import { UserModule } from './../src/schema/user/user.module';
import { CommonModule } from './../src/schema/common/common.module';
import { CachingModule } from './../src/services/caching/caching.module';
import { LogModule } from './../src/schema/log/log.module';
import { LangModule } from './../src/services/lang/lang.module';
import { EnumModule } from './../src/schema/enum/enum.module';
import { NotificationGateway } from './../src/gateways/notification.gateway';
import { UserRepository } from './../src/schema/user/repositories/user.repository';
import { UserAvatarRepository } from './../src/schema/user/repositories/user-avatar.repository';
import { ImageRepository } from './../src/schema/common/repositories/image.repository';
import { IPRepository } from './../src/schema/common/repositories/ip.repository';
import { LanguageRepository } from './../src/schema/common/repositories/language.repository';
import { SmsRepository } from './../src/schema/log/repositories/sms.repository';
import { TokenRepository } from './../src/schema/log/repositories/token.repository';
import { IPService } from './../src/schema/common/services/ip.service';
import { EnumOptionSampleRepository } from './../src/schema/enum/repositories/enum-option-sample.repository';

describe('AppController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;

  const mockUserRepository = {};
  const mockUserAvatarRepository = {};
  const mockImageRepository = {};
  const mockIPRepository = {
    find: jest.fn(),
  };
  const mockLanguageRepository = {};
  const mockSmsRepository = {};
  const mockTokenRepository = {};
  const mockEnumOptionSampleRepository = {};
  const mockIPService = {};
  const mockAppService = {
    ping: jest.fn(() => {
      return 'pong';
    }),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
      providers: [],
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
      .overrideProvider(getRepositoryToken(EnumOptionSampleRepository))
      .useValue(mockEnumOptionSampleRepository)

      .overrideProvider(IPService)
      .useValue(mockIPService)
      .overrideProvider(AppService)
      .useValue(mockAppService)
      
      .compile();

      app = testingModule.createNestApplication();
    await app.init();
  });

  it('/app/ping (GET)', async () => {
    return request
      .default(app.getHttpServer())
      .get('/app/ping')
      .expect(200)
      .expect('pong');
  });
});
