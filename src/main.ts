import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger as NestLogger } from '@nestjs/common';
import { join } from 'path';
import { AppConfigService } from './config/app/config.service';
import { SwaggerConfigService } from './config/swagger/config.service';
import { AppModule } from './schema/app/app.module';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationFilter } from './filters/validation.filter';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationException } from './filters/validation.exception';
import { LangService } from './services/lang/lang.service';
import { WinstonModule } from 'nest-winston';
import { logger } from './helpers/logger.class';
var redis = require('redis');
var responseTime = require('response-time');

async function bootstrap() {
  const nestLogger = new NestLogger('BOOTSTRAP'); 
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(logger.config)
  });
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const swaggerConfig = app.get<SwaggerConfigService>(SwaggerConfigService);
  const langService = app.get<LangService>(LangService);

  app.use(responseTime());
  app.enableCors();
  app.setGlobalPrefix(appConfigService.apiGlobalPrefix);  
  app.useStaticAssets(join(__dirname, process.env.SERVER_STATIC_URL, '_FILES'));
  app.useStaticAssets(join(__dirname, process.env.SERVER_STATIC_URL, '_INDEX'));
  app.useStaticAssets(join(__dirname, process.env.SERVER_STATIC_URL, '_ASSETS'));
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(langService, appConfigService),
    );
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) => `${Object.values(error.constraints).join(', ')}`,
        );
        return new ValidationException(messages);
      },
    }),
  );  
  
  if (swaggerConfig.isEnable) {
    swaggerConfig.init(app);
  }  

  const redisClient = redis.createClient(appConfigService.redisPort, appConfigService.redisHost);
  redisClient.on('connect', async function() {
    nestLogger.log('redis client connected');
    await app.listen(appConfigService.port).then(() => {
      redisClient.set('SERVER_UPTIME', JSON.stringify(Date().toString()), redis.print);
      nestLogger.log(`server listen to: ${appConfigService.port} 🚀`);
    });
  });
  redisClient.on('error', function (err) {
    nestLogger.error('redis not init yet, ' + JSON.stringify(err));
  });  
  redisClient.connect();
}
bootstrap();
