import { Expose } from "class-transformer";

export class UserPublic {
  @Expose()
  public id: string;
  @Expose()
  public firstName: string;
  @Expose()
  public lastName: string;
  @Expose()
  public genderId: string;
  @Expose()
  public jobTitle: string;
  @Expose()
  public bio: string;  

  public constructor(init?:Partial<UserPublic>) {
    Object.assign(this, init);
  }
}