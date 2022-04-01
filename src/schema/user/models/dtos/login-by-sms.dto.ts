import { ApiProperty } from "@nestjs/swagger";

export class LoginBySms {
    mobileNumber:string = '';
    code:string = '';
  }
  