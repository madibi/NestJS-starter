import { Module } from "@nestjs/common";
import { LangModule } from "../lang/lang.module";
import { ImageProcessorService } from "./image-processor.service";

@Module({
  imports: [ 
    // LangModule
  ],
  providers: [
    ImageProcessorService
  ],
  exports: [
    ImageProcessorService
  ]
})
export class ImageProcessorModule {}
