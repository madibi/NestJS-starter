import { Expose } from "class-transformer";
import { UserSemiPrivate } from "./user-semi-private.dto";

export class UserPrivate extends UserSemiPrivate {
  @Expose()
  public userName: string;

  public constructor(init?:Partial<UserPrivate>) {
    super();
    Object.assign(this, init);
  }  
}