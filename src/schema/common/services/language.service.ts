import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './../entities/language.entity';
import { LanguageRepository } from './../repositories/language.repository';
import { default as keys } from './../../../i18n/en-US/i18n.json';
import { LangService } from './../../../services/lang/lang.service';


@Injectable()
export class LanguageService {
    public i18nObj: any = {};

    constructor(
        @InjectRepository(LanguageRepository)
        private languageRepository: LanguageRepository,   
        private readonly langService: LangService,
    ) {
        langService.setKeyToValue(keys);    
    }

    async getLanguages(): Promise<Language[]> {
          return await this.languageRepository.find(); ;
    }
}
