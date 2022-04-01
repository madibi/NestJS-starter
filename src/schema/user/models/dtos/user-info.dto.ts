import { ImageInfo } from "./../../../../schema/common/models/dtos/image-info.dto";
import { User } from "./../../entities/user.entity";
import { UserPrivate } from "./user-private.dto";
import { UserPublic } from "./user-public.dto";
import { UserSemiPrivate } from "./user-semi-private.dto";
import * as Enum_Role from './../enums/role.enum';
import * as Entity_Role from './../../entities/role.entity';


export class UserInfo<
U extends UserPublic | UserSemiPrivate | UserPrivate | User = UserPublic,
R extends Enum_Role.Role | Entity_Role.Role = Enum_Role.Role> {
  public user?: U;
  public roles?: R[] = [];
  public claims?: number[] = [];
  public claimGroups?: number[] = [];
  public avatar? : ImageInfo = new ImageInfo;

  public constructor(init?:Partial<UserInfo<U, R>>) {
    Object.assign(this, init);
  }
}
