import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from 'express';
import { CheckOutObject } from "./../../../schema/common/models/classes/check-out-object.class";
import { UserAvatarRepository } from "../repositories/user-avatar.repository";
import { UserRepository } from "../repositories/user.repository";
import { RequestCodeRQ } from "../models/dtos/request-code-rq.dto";
import { RequestCodeRS } from "../models/dtos/request-code-rs.dto";
import { CheckOut } from "./../../../schema/common/models/classes/check-out.class";
import { FindOneOptions, MoreThan } from "typeorm";
import { RequestCodeSmsType } from "../models/enums/request-code-sms-type.enum";
import { VerifyCodeRQ } from "../models/dtos/verify-code-rq.dto";
import { Token } from "../models/dtos/token.dto";
import { RegisterByMobileNumber } from "./../../../schema/user/models/dtos/register-by-mobile-number.dto";
import { LoginByMobileNumber } from "../models/dtos/login-by-mobile-number.dto";
import { google } from 'googleapis';
import { LoginByEmail } from "../models/dtos/login-by-email.dto";
import { LoginByUsername } from "../models/dtos/login-by-username.dto";
import { User } from "../entities/user.entity";
import { RegisterByEmail } from "../models/dtos/register-by-email.dto";
import { RegisterByUsername } from "../models/dtos/register-by-username.dto";
import { SecurityService } from "./security.service";
import { Language } from "./../../common/entities/language.entity";
import { langKeys, LangService } from "./../../../services/lang/lang.service";
import { SmsService } from "./../../log/services/sms.service";
import { Sms } from "./../../log/entities/sms.entity";
import { SmsSendingType } from "./../../log/models/enums/sms-sending-type.enum";
import { SmsSender } from "./../../log/models/enums/sms-sender.enum";
import { CachingService } from "./../../../services/caching/caching.service";
import * as Enum_Role from './../models/enums/role.enum';
import * as Entity_Role from './../entities/role.entity';
import * as bcrypt from 'bcrypt';
import { RefreshTokenRQ } from "../models/dtos/refresh-token-rq.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository, 
    @InjectRepository(UserAvatarRepository)
    private userAvatarRepository: UserAvatarRepository,      
    private smsService: SmsService,
    private securityService: SecurityService,
    private langService: LangService,
    private cachingService: CachingService,
  ) {}

  public async requestCode(
    requestCodeRQ: RequestCodeRQ,
    languageInfo: string
  ): Promise<{ checkOutObject: CheckOutObject<RequestCodeRS>; code: string }> {
    let checkOutObject = new CheckOutObject<RequestCodeRS>();

    const checkRequestCodeRepetition = await this.checkRequestCodeRepetition(requestCodeRQ);
    if(!checkRequestCodeRepetition.status) {
      checkOutObject.message = checkRequestCodeRepetition.message;
      checkOutObject.status = false;
      return { checkOutObject, code: '' };    
    }

    const {code, hashedCode} = await this.requestCodeGenerateCode();
    checkOutObject = await this.requestCodeSendingSms(requestCodeRQ, code, hashedCode, languageInfo);

    return { checkOutObject, code };
  }

  public async verifyCode(verifyCodeRQ: VerifyCodeRQ, request: Request, languageInfo: string): Promise<CheckOutObject<Token>> {   
    let checkOutObject = new CheckOutObject<Token>();
    const registerByMobileNumberRQ = new RegisterByMobileNumber();
    const loginByMobileNumberRQ = new LoginByMobileNumber();

    const checkVerificationExpiration = await this.checkVerificationExpiration(
      verifyCodeRQ.phonePrefix,
      verifyCodeRQ.mobileNumber,
      languageInfo
      );
    if(!checkVerificationExpiration.status) {
      checkOutObject.message = checkVerificationExpiration.message;
      checkOutObject.status = false;
      return checkOutObject;      
    }

    const checkVerificationCode = await this.checkVerificationCode(
      verifyCodeRQ,
      checkVerificationExpiration.object,
      languageInfo
      );
    if(!checkVerificationCode.status) {
      checkOutObject.message = checkVerificationCode.message;
      checkOutObject.status = false;
      return checkOutObject;      
    }

    const isUserExitsQuery: FindOneOptions = {
      where: {
        phonePrefix: verifyCodeRQ.phonePrefix,
        mobileNumber: this.normalizeMobileNumber(verifyCodeRQ.mobileNumber),
      },
    };
    const isUserExits = await this.userRepository.findOne(isUserExitsQuery);

    if (isUserExits) {
      loginByMobileNumberRQ.phonePrefix = verifyCodeRQ.phonePrefix;
      loginByMobileNumberRQ.mobileNumber = this.normalizeMobileNumber(verifyCodeRQ.mobileNumber);
      const isVerifiedBySms: boolean = true;
      checkOutObject = await this.login(loginByMobileNumberRQ, isVerifiedBySms, request);
    } else {
      registerByMobileNumberRQ.phonePrefix = verifyCodeRQ.phonePrefix;
      registerByMobileNumberRQ.mobileNumber = this.normalizeMobileNumber(verifyCodeRQ.mobileNumber);
      checkOutObject = await this.register(registerByMobileNumberRQ, request, languageInfo);
    }

    return checkOutObject;
  }

  private async checkRequestCodeRepetition(
    requestCodeRQ: RequestCodeRQ
    ): Promise<CheckOut>{
    let checkOut = new CheckOut();
    const checkRequestCodeRepetitionSMSes = 
      await this.checkRequestCodeRepetitionSMSes(requestCodeRQ);


    if (checkRequestCodeRepetitionSMSes.length > parseInt(process.env.VERIFICATION_RESEND_Qnty)) {
      const translate = await this.langService
        .translate(langKeys.user.requestCode.ATTEMPTED_A_LOT, '', {
          qnty: process.env.VERIFICATION_RESEND_Qnty,
          after: parseInt(process.env.VERIFICATION_RESEND_Qnty) / 60000
        });
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;
      checkOut.status = false;
      return checkOut;
    } else if (checkRequestCodeRepetitionSMSes.length > 0) {
      const lastTime = checkRequestCodeRepetitionSMSes[0].date;
      const now = new Date();
      const diffTimeInMillieSeconds = Math.abs(
        checkRequestCodeRepetitionSMSes[0].date.getTime() - new Date().getTime(),
      );
      if (
        diffTimeInMillieSeconds <
        parseInt(process.env.VERIFICATION_RESEND_DELAY)
      ) {
        const translate = await this.langService
        .translate(langKeys.user.requestCode.TRY_AGAIN, '', {
          after: parseInt(process.env.VERIFICATION_RESEND_DELAY) / 60000
        });
        checkOut.message = translate.message;
        checkOut.messageCode = translate.code;
        checkOut.status = false;
        return checkOut;        
      }
    }

    return checkOut;
  }

  private async checkRequestCodeRepetitionSMSes(
    requestCodeRQ: RequestCodeRQ
    ): Promise<Sms[]>{
    const before = new Date(
      new Date().getTime() - parseInt(process.env.VERIFICATION_RESEND_DELAY),
      );

    const query: FindOneOptions = {
      where: {
        phonePrefix: requestCodeRQ.phonePrefix,
        mobileNumber: this.normalizeMobileNumber(
          requestCodeRQ.mobileNumber,
        ),
        sendingType: SmsSendingType[SmsSendingType.VERIFICATION],
        date: MoreThan(before),
      },
      order: {
        id: 'DESC',
      },
    };

    return await this.smsService.findSMSes(query);
  }

  private async requestCodeGenerateCode()
  : Promise<{code: string, hashedCode: string}>{
    const code = (Math.floor(Math.random() * 90000) + 10000).toString();
    const hashedCode = await bcrypt.hash(
      code,
      parseInt(process.env.SALT_OR_ROUNDS),
    );
    
    // const content = 'your verification code is: \n' + code; // sms.ir
    return {code, hashedCode};
  }

  private async requestCodeSendingSms(
    requestCodeRQ: RequestCodeRQ,
    code: string,
    hashedCode: string,
    languageInfo: string
    ): Promise<CheckOutObject<RequestCodeRS>>{
    let checkOutObject = new CheckOutObject<RequestCodeRS>();
    // TODO: remove remark
    const isDevelopMode = true; // process.env.APP_ENV === 'development';

    if (requestCodeRQ.smsType === RequestCodeSmsType.APP) {
      checkOutObject = await this.smsService.sendSmsByApp(
        requestCodeRQ.phonePrefix,
        this.normalizeMobileNumber(requestCodeRQ.mobileNumber),
        SmsSendingType.VERIFICATION,
        code,
        hashedCode,
        SmsSender.KAVEH_NEGAR,
        isDevelopMode,
        languageInfo
      );
    } else {
      checkOutObject = await this.smsService.sendSmsByFirebase(
        requestCodeRQ.phonePrefix,
        this.normalizeMobileNumber(requestCodeRQ.mobileNumber),
        requestCodeRQ.recaptchaToken
      );
    }   
    
    return checkOutObject;
  }

  private normalizeMobileNumber(mobileNumber: string): string {
    let normalizedMobileNumber = '';
    if (mobileNumber.length > 10 && mobileNumber.startsWith('0')) {
      normalizedMobileNumber = mobileNumber.substring(1);
    } else {
      normalizedMobileNumber = mobileNumber;
    }
    return normalizedMobileNumber;
  }
  
  private async checkVerificationExpiration(
    phonePrefix: string,
    mobileNumber: string,
    languageInfo: string
  ): Promise<CheckOutObject<string>>{
    let checkOutObject = new CheckOutObject<string>();

    const findSmsInCache = await this.cachingService.getAuthSms(
      phonePrefix, 
      this.normalizeMobileNumber(mobileNumber), 
      SmsSendingType.VERIFICATION
      );

    if (!findSmsInCache) {
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_PAYLOAD, languageInfo);
      checkOutObject.message = translate.message;
      checkOutObject.messageCode = translate.code;
      checkOutObject.status = false;
    } else {
      checkOutObject.object = findSmsInCache;
    }
    return checkOutObject;
  }

  private async checkVerificationCode(
    verifyCodeRQ: VerifyCodeRQ, 
    savedCode: string,
    languageInfo: string
    ): Promise<CheckOut> {
    if(verifyCodeRQ.smsType === RequestCodeSmsType.APP) {
      return await this.checkVerificationAppCode(verifyCodeRQ.code, savedCode, languageInfo);
    } else {
      return await this.checkVerificationFireBaseCode(verifyCodeRQ.code, verifyCodeRQ.sessionInfo, languageInfo);
    }
  }

  private async checkVerificationFireBaseCode(
    code: string, 
    sessionInfo: string,
    languageInfo: string
    ): Promise<CheckOut> {
    const checkOut = new CheckOut();
    try{
      const apiKey = 'AIzaSyDCj19xNpqhg1G_n-iwD8Ns0dcTGQ4FGy0';
      const identityToolkit = google.identitytoolkit({
        auth: apiKey,
        version: 'v3',
      });

      const response = await identityToolkit.relyingparty.verifyPhoneNumber({
        requestBody: {
          code,
          // idToken: "my_idToken",
          // operation: "my_operation",
          // phoneNumber: "my_phoneNumber",
          sessionInfo,
          // temporaryProof: "my_temporaryProof",
          // verificationProof: "my_verificationProof"                
        },
      });  

      if (response.status === 200) {
        const data = {          
          expiresIn: response.data.expiresIn,
          idToken: response.data.idToken,
          isNewUser: response.data.isNewUser,
          localId: response.data.localId,
          phoneNumber: response.data.phoneNumber,
          refreshToken: response.data.refreshToken
        };
        // return {data};
      } else {
        const translate = await this.langService.translate(langKeys.user.firebase.VERIFY_CODE_ERROR, languageInfo);
        checkOut.message = translate.message;
        checkOut.messageCode = translate.code;
        checkOut.status = false;
      }
    } catch(e){
      const translate = await this.langService.translate(langKeys.user.firebase.CODE_ERROR, languageInfo);
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;      
      checkOut.status = false;
    }
    return checkOut;
  }

  private async checkVerificationAppCode(
    code: string, savedCode: string,
    languageInfo: string
    ): Promise<CheckOut> {
    const checkOut = new CheckOut();
    // const isMatch = await bcrypt.compare(
    //   code,
    //   savedCode,
    // );
    const isMatch = code === savedCode;
    if (!isMatch) {
      const translate = await this.langService.translate(langKeys.user.firebase.CODE_INCORRECT, languageInfo);
      checkOut.message = translate.message;
      checkOut.messageCode = translate.code;       
      checkOut.status = false;
    }
    return checkOut;
  }  

  private async login(
    login: LoginByEmail | LoginByMobileNumber | LoginByUsername,
    isVerifiedBySms: boolean = false,
    request: Request
  ): Promise<CheckOutObject<Token>> {
    const checkOutObject = new CheckOutObject<Token>();
    let user: User = null;

    if ('emailAddress' in login) {
      const query: FindOneOptions = {
        where: {
          emailAddress: (login as LoginByEmail).emailAddress,
        },
      };
      user = await this.userRepository.findOne(query);
    } else if ('mobileNumber' in login) {
      const query: FindOneOptions = {
        where: {
          phonePrefix: (login as LoginByMobileNumber).phonePrefix,
          mobileNumber: (login as LoginByMobileNumber).mobileNumber,
        },
        relations: ['roles'],
      };
      user = await this.userRepository.findOne(query);
    } else if ('userName' in login) {
      const query: FindOneOptions = {
        where: {
          userName: (login as LoginByUsername).userName,
        },
      };
      user = await this.userRepository.findOne(query);
    } else {
      checkOutObject.status = false;
      checkOutObject.message = 'not proper payload';
    }

    if (!user) {
      checkOutObject.status = false;
      checkOutObject.message = 'identifier or password is not correct';
      return checkOutObject;
    } else {
      if (!isVerifiedBySms) {
        const isMatch = await bcrypt.compare(login.password, user.password);
        if (!isMatch) {
          checkOutObject.status = false;
          checkOutObject.message = 'identifier or password is not correct';
          return checkOutObject;
        }
      }
    }

    checkOutObject.object = await this.securityService.prepareToken(user.id, request);
    return checkOutObject;
  }

  private async register(
    register: RegisterByEmail | RegisterByMobileNumber | RegisterByUsername,
    request: Request,
    languageInfo: string
  ): Promise<CheckOutObject<Token>> {
    const checkOutObject = new CheckOutObject<Token>();
    let user: User = null;

    const result = await this.create(register, languageInfo);
    if (!result.status) {
      checkOutObject.status = false;
      checkOutObject.message = result.message;
      return checkOutObject;
    } else {
      user = result.object;
      // get user by roles
      const query: FindOneOptions = {
        where: {
          phonePrefix: user.phonePrefix,
          mobileNumber: user.mobileNumber,
        },
        relations: ['roles'],
      };
      user = await this.userRepository.findOne(query);
    }
    checkOutObject.object = await this.securityService.prepareToken(user.id, request);
    return checkOutObject;
  }

  private async create(
    register: RegisterByEmail | RegisterByMobileNumber | RegisterByUsername,
    languageInfo: string
  ): Promise<CheckOutObject<User>> {
    const checkOutObject = new CheckOutObject<User>();

    if ('emailAddress' in register) {
      const query: FindOneOptions<User> = {
        where: {
          emailAddress: (register as RegisterByEmail).emailAddress,
        },
      };
      const isExist = await this.userRepository.find(query);
      if (isExist) {
        const translate = await this.langService.translate(langKeys.auth.EMAIL_EXIST, languageInfo);        
        checkOutObject.status = false;
        checkOutObject.message = translate.message;
        checkOutObject.messageCode = translate.code;
        return checkOutObject;
      }
    } else if ('mobileNumber' in register) {
      const query: FindOneOptions<User> = {
        where: {
          phonePrefix: (register as RegisterByMobileNumber).phonePrefix,
          mobileNumber: this.normalizeMobileNumber(
            (register as RegisterByMobileNumber).mobileNumber,
          )
        },
      };
      const isUserExist = await this.userRepository.findOne(query);
      if (isUserExist) {
        const translate = await this.langService.translate(langKeys.auth.EMAIL_EXIST, languageInfo);        
        checkOutObject.status = false;
        checkOutObject.message = translate.message;
        checkOutObject.messageCode = translate.code;
        return checkOutObject;
      }
    } else if ('userName' in register) {
      const query: FindOneOptions<User> = {
        where: {
          userName: (register as RegisterByUsername).userName,
        },
      };
      const isExist = await this.userRepository.find(query);
      if (isExist) {
        const translate = await this.langService.translate(langKeys.auth.USERNAME_EXIST, languageInfo);        
        checkOutObject.status = false;
        checkOutObject.message = translate.message;
        checkOutObject.messageCode = translate.code;
        return checkOutObject;
      }
    } else {
      const translate = await this.langService.translate(langKeys.auth.NOT_PROPER_PAYLOAD, languageInfo);        
      checkOutObject.status = false;
      checkOutObject.message = translate.message;
      checkOutObject.messageCode = translate.code;
      return checkOutObject;
    }

    const defaultRoles = await Entity_Role.Role.findOne({
      where: {
        key: Enum_Role.Role[Enum_Role.Role.USER]
      }
    });

    const defaultLanguage = await Language.findOne({
      where: {
        languageCode: 'en',
        languageLocale: 'US'
      }
    });

    const user = {
      emailAddress: 'emailAddress' in register ? (register as RegisterByEmail).emailAddress : null,
      phonePprefix: 'mobileNumber' in register ? (register as RegisterByMobileNumber).phonePrefix : null,
      mobileNumber: 'mobileNumber' in register ? this.normalizeMobileNumber((register as RegisterByMobileNumber).mobileNumber) : null,
      userName: 'userName' in register ? (register as RegisterByUsername).userName : null,
      password: (register as RegisterByMobileNumber).password,
      preferrerLanguageId: defaultLanguage.id,
      roles: [defaultRoles],
    } as unknown as User;
    checkOutObject.object = await this.userRepository.save(this.userRepository.create(user));

    return checkOutObject;
  }

  public async refreshToken(
    refreshTokenRQ: RefreshTokenRQ,
    request: Request,
  ): Promise<CheckOutObject<Token>> {
    const checkOutObject = new CheckOutObject<Token>();

    // TODO: handle fake token and expired token
    // for feature need to handle token errors
    const refreshTokenPayload = this.securityService.decodeJwt(
      refreshTokenRQ.refreshToken,
    );

    if (refreshTokenPayload.object && (refreshTokenRQ.userId == refreshTokenPayload.object.userId)) {
      const user = await this.userRepository.findOne({
        where: {
          id: refreshTokenRQ.userId,
        },
        relations: ['roles'],
      });

      // TODO: here we can check to access or not
      checkOutObject.object = await this.securityService.prepareToken(user.id, request);
    } else {
      checkOutObject.status = false;
    }

    return checkOutObject;
  }
}