import { Expose } from "class-transformer";
import { UserPublic } from "./user-public.dto";

export class UserSemiPrivate extends UserPublic {
  @Expose()
  public phonePrefix: string;
  @Expose()
  public mobileNumber: string;
  @Expose()
  public phoneNumber: string;
  @Expose()
  public emailAddress: string;
  @Expose()
  public address: string;
  @Expose()
  public skills: string;  
  @Expose()
  public aboutMe: string;  

  public constructor(init?:Partial<UserSemiPrivate>) {
    super();
    Object.assign(this, init);
  }  
}