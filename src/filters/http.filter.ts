import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from './../schema/common/models/classes/response.class';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {

        let response = new Response<null>();
        const ctx = host.switchToHttp();
        const ctxResponse = ctx.getResponse();
        const ctxRequest = ctx.getRequest();
        const statusCode = exception.getStatus();

        response.header.methodInfo = {
            status: false,
            messageCode: '',
            message: exception.message
        };

        return ctxResponse
            .status(statusCode)
            .json(response.Get());
    }
}
