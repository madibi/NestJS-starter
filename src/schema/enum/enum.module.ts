import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnumOptionSampleRepository } from "./repositories/enum-option-sample.repository";
import { EnumController } from "./controllers/enum.controller";
import { EnumService } from "./services/enum.service";
import { CommonModule } from "./../common/common.module";

@Module({
  imports: [ 
    HttpModule,    
    TypeOrmModule.forFeature([
      EnumOptionSampleRepository,
    ]),
    CommonModule
  ],
  controllers: [EnumController],
  providers: [
    EnumService
  ],
  exports: []
})
export class EnumModule {}