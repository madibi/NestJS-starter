import { CacheInterceptor, MiddlewareConsumer, Module, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwaggerConfigModule } from './../../config/swagger/config.module';
import { AppConfigModule } from './../../config/app/config.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgreSql } from './../../config/database/database.config';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './../user/user.module';
import { logger } from './../../helpers/logger.class';
import { AccessTokenMiddleware } from './../../middleware/access-token.middleware';
import { LanguageInfoMiddleware } from './../../middleware/language-info.middleware';
import { HttpLoggerMiddleware } from './../../middleware/http-logger.middleware';
import { RolesClaimsGuard } from './../../guards/roles-claims.guard';
import { StrictGuard } from './../../guards/strict.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { NotificationGateway } from './../../gateways/notification.gateway';
import { CommonModule } from './../../schema/common/common.module';
import { CacheModule } from './../../nestjs/cache.module';
import { CachingModule } from './../../services/caching/caching.module';
import { LogModule } from './../../services/log/log.module';
import { LangModule } from './../../services/lang/lang.module';
import { EnumModule } from './../../schema/enum/enum.module';
import * as winston from 'winston';

@Module({
  imports: [     
    HttpModule,
    AppConfigModule,
    SwaggerConfigModule,
    TypeOrmModule.forRoot(postgreSql),
    WinstonModule.forRoot(logger.config), 
    I18nModule.forRoot({
      fallbackLanguage: 'en-US',
      parser: I18nJsonParser,
      parserOptions: {
        path: process.env.I18N_PATH, 
      },
    }), 
    CacheModule,
    UserModule,
    CommonModule,
    CachingModule,    
    LogModule,
    LangModule,
    EnumModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,   
    NotificationGateway,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },    
    { provide: APP_GUARD, useClass: StrictGuard },     
    { provide: APP_GUARD, useClass: RolesClaimsGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessTokenMiddleware).forRoutes('*');
    consumer.apply(LanguageInfoMiddleware).forRoutes('*');
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }  
}
