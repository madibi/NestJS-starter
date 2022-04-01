import { Module } from "@nestjs/common";
import { CacheModule } from "./../../nestjs/cache.module";
import { AppConfigModule } from "./../../config/app/config.module";
import { CachingService } from "./caching.service";

@Module({
  imports: [ 
    CacheModule,
    AppConfigModule,
  ],
  providers: [
    CachingService
  ],
  exports: [
    CachingService
  ]
})
export class CachingModule {}
