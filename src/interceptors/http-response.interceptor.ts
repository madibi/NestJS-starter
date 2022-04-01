import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from './../schema/common/models/classes/response.class';

@Injectable()
export class HttpResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = new Response<T>();
    return next.handle().pipe(
      map((data) => {
        // when we need to set seo information, we prepare response in controller
        if (data && data.hasOwnProperty('Header') && data.hasOwnProperty('Body')) {
          return data;
        } else {
          response.body = (data === undefined || data === null) ? null : data;
          return response;
        }
      }),
    );
  }
}
