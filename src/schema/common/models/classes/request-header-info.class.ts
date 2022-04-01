import { LanguageCode } from "./../enums/language-code.enum";
import { LanguageLocale } from "./../enums/language-locale.enum";

export class RequestHeaderInfo {
    public languageCode: LanguageCode;
    public languageLocale: LanguageLocale;

    public constructor(init?:Partial<RequestHeaderInfo>) {
        Object.assign(this, init);
    }    
}