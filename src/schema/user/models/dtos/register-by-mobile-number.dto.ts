import { ApiProperty } from '@nestjs/swagger';
import { Length, MaxLength, MinLength } from 'class-validator';

export class RegisterByMobileNumber {
  @Length(4)
  phonePrefix = '';
  @Length(11)
  mobileNumber = '';
  @MinLength(4)
  @MaxLength(20)
  password = null;
}
