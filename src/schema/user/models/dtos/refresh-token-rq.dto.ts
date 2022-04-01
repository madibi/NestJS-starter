import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class RefreshTokenRQ {
    refreshToken:string = '';
    userId:string = '';
  }