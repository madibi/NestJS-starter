import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnumInfo } from '../models/dtos/enum-info.dto';
import { EnumService } from '../services/enum.service';

// TODO: REMOVE DEMO METHODS OR DISABLE ON PRODUCT MODE

@Controller('enum')
@ApiTags('enum')
@Controller()
export class EnumController {
  constructor(
    private readonly enumService: EnumService,
  ) { }

  @Get('enumInfo/:languageId') 
  enumInfo(@Param('languageId') languageId: number): Promise<EnumInfo> {
    return this.enumService.enumInfo(languageId);
  }  
}
