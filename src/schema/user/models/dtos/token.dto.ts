import { ApiExtraModels } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { UserInfo } from './user-info.dto';
import { UserPrivate } from './user-private.dto';

export class Token {
  userInfo: UserInfo<UserPrivate, Role>;
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
  appId: string;

  public constructor(init?:Partial<Token>) {
    Object.assign(this, init);
  }
}
