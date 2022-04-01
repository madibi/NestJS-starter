import { Injectable, NotImplementedException } from "@nestjs/common";
import { I18nService } from 'nestjs-i18n';
import { exceptions } from "winston";
import { Translate } from "./../../schema/common/models/classes/translate.class";
export { default as langKeys } from "./../../i18n/en-US/i18n.json";
import { ValidationErrorObject } from "./../../schema/common/models/classes/validation-error-object.class";

@Injectable()
export class LangService {

    constructor(
        private readonly i18nService: I18nService,
    ) {
    }

    async translate(property: any, locale: string, args: any = null): Promise<Translate> {
        let translate = new Translate();
        translate.code = property;
        const i18n = `i18n.${property}`;
        translate.message = await this.i18nService.translate(i18n, {
            lang: locale,
            args,
        });
        return translate;
    }

    public setKeyToValue(json: any, parent?: string) {
        for (let key in json) {
            if (typeof json[key] === 'string') {
                json[key] = parent ? `${parent}.${key}` : key;
            } else {
                const currentParent = parent ? `${parent}.${key}` : key;
                this.setKeyToValue(json[key], currentParent);
            }
        }
    }

    async translateValidationErrors(validationErrors: string[], locale: string): Promise<{ messages: string[]; codes: string[]; }> {
        const messages = [];
        const codes = [];

        for (const classErrors of validationErrors) {
            const propertyErrors = classErrors.split(', ');
            for (const propertyError of propertyErrors) {
                const args = {};
                if(!this.isJsonString(propertyError)) {
                    throw new NotImplementedException('please check: src\\packages\\class-validator, not included this error yet');
                }
                const error: ValidationErrorObject = JSON.parse(propertyError);
                const i18n = `i18n.validation.${error.key}`;
                error.properties.forEach((v) => {
                    const key = Object.keys(v)[0];
                    args[`$${key}`] = v[key];
                });
                error.constraints.forEach((v) => {
                    const key = Object.keys(v)[0];
                    args[`$${key}`] = v[key];
                });            
                codes.push(error.key);
                const message = await this.i18nService.translate(i18n, {
                    lang: 'fa-IR',
                    args
                });
                messages.push(message);
            }
          }
   
        return { messages, codes }; 
    }

    isJsonString(string: string) {
        try {
            JSON.parse(string);
        } catch (e) {
            return false;
        }
        return true;
    }
}

