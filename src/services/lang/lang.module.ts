import { Module } from "@nestjs/common";
import { LangService } from "./lang.service";


@Module({
  imports: [ 
  ],
  providers: [
    LangService
  ],
  exports: [
    LangService
  ]
})
export class LangModule {}
