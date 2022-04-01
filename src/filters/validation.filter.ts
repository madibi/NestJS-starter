import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationException } from './validation.exception';
import { Response } from './../schema/common/models/classes/response.class';
import { langKeys, LangService } from './../services/lang/lang.service';
import { AppConfigService } from './../config/app/config.service';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  constructor(
    private readonly langService: LangService,
    private readonly appConfigService: AppConfigService,    
    ) {}

  async catch(
    exception: ValidationException,
    host: ArgumentsHost,
  ): Promise<any> {
    let response = new Response<null>();
    const ctxRequest = host.switchToHttp().getRequest();
    const ctxResponse = host.switchToHttp().getResponse();
    const languageInfo = ctxRequest.languageInfo;
    const translate = await this.langService.translate(
      langKeys.validation.NOT_VALID_INPUT_FIELD,
      languageInfo,
    );

    if (this.appConfigService.translateClassValidation) {
      const errors = await this.langService.translateValidationErrors(
        exception.validationErrors,
        languageInfo,
      );
      response.header.methodInfo = {
        status: false,
        message: `${translate.message} ${errors.messages.join(', ')}`,
        messageCode: errors.codes,
      };
    } else {
      const exceptions = exception.validationErrors.join(', ');
      response.header.methodInfo = {
        status: false,
        message: `${translate.message}: ${exceptions}`,
        messageCode: translate.code,
      };
    }

    return ctxResponse.status(HttpStatus.BAD_REQUEST).json(response.Get());
  }
}
