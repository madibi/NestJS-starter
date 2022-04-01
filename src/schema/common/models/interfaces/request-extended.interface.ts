import { AccessTokenPayload } from './../../../../schema/user/models/classes/access-token-payload.class';
import { RequestHeaderInfo } from './../classes/request-header-info.class';

export interface RequestExtended extends Request {
    accessTokenPayload: AccessTokenPayload;
    languageInfo: string;
    headerInfo: RequestHeaderInfo;
  }