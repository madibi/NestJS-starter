import { ApiProperty } from "@nestjs/swagger";

export class LoginByUsername {
    @ApiProperty()
    userName:string = '';
    @ApiProperty()    
    password:string = '';
  }
  