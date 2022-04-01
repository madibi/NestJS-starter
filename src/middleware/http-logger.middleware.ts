import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new NestLogger('HTTP');  
  constructor(
  ) { }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    request.on("end", () => {
      this.logger.log(`[Request][${method}] originalUrl:[${decodeURI(originalUrl)}] userAgent:[${userAgent}] ip:[${ip}]`);
    });

    request.on("data", () => {
    });    

    request.on("connect", () => {
    });

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(`[Response][${method}] originalUrl:[${decodeURI(originalUrl)}] statusCode:[${statusCode}] contentLength:[${contentLength}] userAgent:[${userAgent}] ip:[${ip}]`);
    });

    next();
  }
}