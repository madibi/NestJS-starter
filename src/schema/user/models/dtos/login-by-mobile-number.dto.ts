import { ApiProperty } from "@nestjs/swagger";

export class LoginByMobileNumber {  
    public phonePrefix:string = '';
    public mobileNumber:string = '';
    public password:string = '';
  }
  