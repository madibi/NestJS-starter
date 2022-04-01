import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { UserAvatarRepository } from './repositories/user-avatar.repository';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { CommonModule } from './../../schema/common/common.module';
import { SecurityService } from './services/security.service';
import { ImageProcessorModule } from './../../services/image-processor/image-processor.module';
import { LangModule } from './../../services/lang/lang.module';
import { CachingModule } from './../../services/caching/caching.module';
import { LogModule } from './../log/log.module';

@Module({
	imports: [
   HttpModule,
    MulterModule,
    TypeOrmModule.forFeature([
      UserRepository, 
      UserAvatarRepository,
    ]),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
    }),
    CommonModule,
    LogModule,
    ImageProcessorModule,
    LangModule,
    CachingModule
	],  
  providers: [UserService, SecurityService],
  controllers: [AuthController],
  exports: [UserService, SecurityService]
})
export class UserModule {}
