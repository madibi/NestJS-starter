import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmsRepository } from "./repositories/sms.repository";
import { SmsService } from "./services/sms.service";
import { TokenRepository } from './repositories/token.repository';
import { LangModule } from "./../../services/lang/lang.module";
import { TokenService } from "./services/token.service";
import { CachingModule } from "./../../services/caching/caching.module";

@Module({
  imports: [ 
    HttpModule,    
    TypeOrmModule.forFeature([
      SmsRepository,
      TokenRepository,
    ]),
    LangModule,
    CachingModule,
  ],
  controllers: [],
  providers: [
    SmsService,    
    TokenService,
  ],
  exports: [
    SmsService,
    TokenService
  ]
})
export class LogModule {}
