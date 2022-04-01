import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageRepository } from './repositories/image.repository';
import { IPRepository } from './repositories/ip.repository';
import { LanguageRepository } from './repositories/language.repository';
import { LanguageService } from './services/language.service';
import { IPService } from './services/ip.service';
import { LangModule } from './../../services/lang/lang.module';
import * as winston from 'winston';

@Module({
  imports: [ 
    HttpModule,    
    TypeOrmModule.forFeature([
      ImageRepository,
      IPRepository,
      LanguageRepository
    ]),
    LangModule,
  ],
  controllers: [],
  providers: [
    LanguageService,
    IPService,
  ],
  exports: [
    LanguageService,
    IPService,
  ]
})
export class CommonModule {}
