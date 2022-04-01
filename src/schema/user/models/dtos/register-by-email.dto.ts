import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class RegisterByEmail {
    @ApiProperty()
    @IsEmail()
    emailAddress:string = '';
    @ApiProperty()
    @MinLength(4)
    @MaxLength(20)
    password:string = '';
  }