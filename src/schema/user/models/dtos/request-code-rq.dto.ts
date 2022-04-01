import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { RequestCodeSmsType } from './../enums/request-code-sms-type.enum';
import { RequestCodeType } from './../enums/request-code-type.enum';

export class RequestCodeRQ {
  type: RequestCodeType;
  smsType: RequestCodeSmsType;
  @ApiProperty()
  @Length(1, 4)
  phonePrefix: string;
  @ApiProperty()
  @Length(5, 15)
  mobileNumber: string;
  recaptchaToken?: string;  
}
