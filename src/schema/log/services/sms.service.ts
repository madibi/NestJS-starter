import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Sms } from "./../entities/sms.entity";
import { google } from 'googleapis';
import { FindManyOptions, FindOneOptions } from "typeorm";
import { langKeys, LangService } from "./../../../services/lang/lang.service";
import { SmsRepository } from "../repositories/sms.repository";
import { SmsSendingType } from "../models/enums/sms-sending-type.enum";
import { SmsSender } from "../models/enums/sms-sender.enum";
import { RequestCodeRS } from "./../../user/models/dtos/request-code-rs.dto";
import { SmsIrTokenRs } from "../models/interfaces/sms-ir-token-rs.interface";
import { SmsIrCodeRS } from "../models/classes/sms-ir-code-res.class";
import { CheckOutObject } from "./../../common/models/classes/check-out-object.class";
import { KavehNegarVerifyRS } from "./../../common/models/interfaces/kaveh-negar-verify-rs.interface";
import { CachingService } from "./../../../services/caching/caching.service";

@Injectable()
export class SmsService {

  languageInfo: string;

  constructor(
    @InjectRepository(SmsRepository)
    private smsRepository: SmsRepository,
    private httpService: HttpService,
    private langService: LangService,
    private cachingService: CachingService,
  ) { }

  public async sendSmsByApp(
    phonePrefix: string,
    mobileNumber: string,
    smsSendingType: SmsSendingType,
    content: string,
    hashedContent: string,
    smsSender: SmsSender,
    isDevelopMode: boolean,
    languageInfo: string
  ): Promise<CheckOutObject<RequestCodeRS>> {
    let checkOutObject = new CheckOutObject<RequestCodeRS>();
    try {
      if (!isDevelopMode) {
        switch (smsSender) {
          case SmsSender.SMS_DOT_IR:
            // TODO: prepare SMS_SMS_IR_USER_API_KEY and SMS_SMS_IR_SECRET_KEY
            const SMS_SMS_IR_USER_API_KEY = ''; // this.configService.get('SMS_SMS_IR_USER_API_KEY');
            const SMS_SMS_IR_SECRET_KEY = ''; // this.configService.get('SMS_SMS_IR_SECRET_KEY');
            const smsIrTokenRs = await this.httpService
              .post<SmsIrTokenRs>('https://RestfulSms.com/api/Token', {
                UserApiKey: SMS_SMS_IR_USER_API_KEY,
                SecretKey: SMS_SMS_IR_SECRET_KEY,
              })
              .toPromise();

            if (!smsIrTokenRs.data.IsSuccessful) {
              checkOutObject.status = false;
              checkOutObject.message = smsIrTokenRs.data.Message;
              return checkOutObject;
            }

            const headers = {
              'Content-Type': 'application/json', // afaik this one is not needed
              'x-sms-ir-secure-token': `${smsIrTokenRs.data.TokenKey}`,
            };
            const sendCodeResult = await this.httpService
              .post<SmsIrCodeRS>(
                'https://RestfulSms.com/api/MessageSend',
                {
                  Messages: [content],
                  MobileNumbers: [mobileNumber],
                  LineNumber: '',
                  SendDateTime: '',
                  CanContinueInCaseOfError: 'false',
                },
                { headers },
              )
              .toPromise();
            break;
          case SmsSender.KAVEH_NEGAR:
            // TODO: add SMS_KAVEH_NEGAR_API_KEY
            const SMS_KAVEH_NEGAR_API_KEY = '' // this.configService.get('SMS_KAVEH_NEGAR_API_KEY');
            const url = `https://api.kavenegar.com/v1/${SMS_KAVEH_NEGAR_API_KEY}/verify/lookup.json?receptor=${mobileNumber}&token=${content}&template=elitejobfinder`;
            const kavehNegarVerifyRs = await this.httpService
              .get<KavehNegarVerifyRS>(url)
              .toPromise();
            break;
        }
      }

      // just for log purpose
      const logSmsResult = await this.logSms(
        phonePrefix,
        mobileNumber,
        smsSendingType,
        hashedContent,
      );

      // in memory strategy
      await this.cachingService.setAuthSms(
        phonePrefix, 
        mobileNumber, 
        smsSendingType, 
        content
        );

      if (!logSmsResult.status) {
        const translate = await this.langService.translate(langKeys.common.sms.SAVING_LOG_FAILED, languageInfo);
        checkOutObject.status = false;
        checkOutObject.message = translate.message;
        checkOutObject.messageCode = translate.code;
        return checkOutObject;
      }
    } catch (error) {
      checkOutObject.status = false;
      checkOutObject.message = error.message;
      return checkOutObject;
    }

    return checkOutObject;
  }

  public async sendSmsByFirebase(
    phonePrefix: string,
    mobileNumber: string,
    recaptchaToken: string
  ): Promise<CheckOutObject<RequestCodeRS>> {
    let checkOutObject = new CheckOutObject<RequestCodeRS>();
    checkOutObject.object = new RequestCodeRS();

    try {
      const apiKey = 'AIzaSyDCj19xNpqhg1G_n-iwD8Ns0dcTGQ4FGy0';
      const identityToolkit = google.identitytoolkit({
        auth: apiKey,
        version: 'v3',
      });

      const phoneNumber = phonePrefix + mobileNumber;
      const response = await identityToolkit.relyingparty.sendVerificationCode({
        requestBody: {
          // iosReceipt: "my_iosReceipt",
          // iosSecret: "my_iosSecret",
          phoneNumber,
          recaptchaToken
        },
      });

      if (response.status === 200) {
        // return {sessionInfo: response.data.sessionInfo};
        checkOutObject.object = new RequestCodeRS({
          sessionInfo: response.data.sessionInfo
        });

        // just for log purpose
        const logSmsResult = await this.logSms(
          phonePrefix,
          mobileNumber,
          SmsSendingType.VERIFICATION,
          response.data.sessionInfo,
        );

        // in memory strategy
        await this.cachingService.setAuthSms(
          phonePrefix,
          mobileNumber,
          SmsSendingType.VERIFICATION,
          response.data.sessionInfo
        );

        if (!logSmsResult.status) {
          checkOutObject.status = false;
          checkOutObject.message = 'saving sms log failed, try again';
          return checkOutObject;
        }
      } else {
        checkOutObject.status = false;
        checkOutObject.message = 'fireBase send code response error';
        checkOutObject.httpStatus = response.status;
      }
    } catch (e) {
      checkOutObject.status = false;
      checkOutObject.message = 'fireBase send code response error ' + e.message;
      checkOutObject.httpStatus = e.code;
    }

    return checkOutObject;
  }

  public async findSMS(query: FindOneOptions): Promise<Sms> {
    return await this.smsRepository.findOne(query);
  }

  public async findSMSes(query: FindManyOptions): Promise<Sms[]> {
    return await this.smsRepository.find(query);
  }

  public async logSms(
    phonePrefix: string,
    mobileNumber: string,
    smsSendingType: SmsSendingType,
    content: string,
  ): Promise<CheckOutObject<Sms>> {
    const checkOutObject = new CheckOutObject<Sms>();
    const sms = {
      phonePrefix: phonePrefix,
      mobileNumber: mobileNumber,
      sendingType: SmsSendingType[smsSendingType],
      content,
    } as Sms;
    checkOutObject.object = await this.smsRepository.save(this.smsRepository.create(sms));

    return checkOutObject;
  }
}