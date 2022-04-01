import { RequestCodeSmsType } from "./../enums/request-code-sms-type.enum";
import { RequestCodeType } from "./../enums/request-code-type.enum";

export class AuthInfo {
    public type: RequestCodeType;
    public smsType: RequestCodeSmsType;
    public phonePrefix: string;
    public mobileNumber: string;
    public recaptchaToken: string;
    public sessionInfo: string;
    public enteredCode: string;
}
