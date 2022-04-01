import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";

export class RegisterByUsername {
    @ApiProperty()
    @MinLength(4)
    @MaxLength(20)
    userName:string = '';
    @ApiProperty()
    @MinLength(4)
    @MaxLength(20)
    password:string = '';
  }