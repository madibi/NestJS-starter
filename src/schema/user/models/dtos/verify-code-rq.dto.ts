import { RequestCodeSmsType } from "./../enums/request-code-sms-type.enum";

export class VerifyCodeRQ {
  public smsType: RequestCodeSmsType;
  public phonePrefix: string;
  public mobileNumber: string;
  public sessionInfo: string;
  public code: string;
}
