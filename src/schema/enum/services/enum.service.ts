import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumOptionSampleRepository } from '../repositories/enum-option-sample.repository';
import { EnumInfo } from '../models/dtos/enum-info.dto';
import { Options } from '../models/dtos/options.dto';
import { LanguageService } from './../..//common/services/language.service';

@Injectable()
export class EnumService {

  constructor(
    @InjectRepository(EnumOptionSampleRepository)
    private enumOptionSampleRepository: EnumOptionSampleRepository,
    private languageService: LanguageService    
  ) { }

  async enumInfo(languageId: number): Promise<EnumInfo> {
    let enumInfo = new EnumInfo();
    let options = new Options();
    enumInfo.options = options;

    const res = await Promise.all([
        this.enumOptionSampleRepository.filterLanguage(languageId) as any,       
        this.languageService.getLanguages(),      
    ]) as any;

    enumInfo.options.enumOptionSample = res[0];    
    enumInfo.languages = res[1];    

    return enumInfo;
  } 
}
