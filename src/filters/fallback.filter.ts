import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import { Response } from './../schema/common/models/classes/response.class';

@Catch()
export class FallbackExceptionFilter implements ExceptionFilter{

    catch(exception: any, host: ArgumentsHost)  {

        let response = new Response<null>();
        const ctx = host.switchToHttp();
        const ctxResponse = ctx.getResponse();
        response.header.processInfo = {
            status: false,
            messageCode: '',
            message: exception.message
        };       
        return ctxResponse
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(response.Get());        
    }
}
