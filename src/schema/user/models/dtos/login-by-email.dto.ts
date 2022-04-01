import { ApiProperty } from '@nestjs/swagger';

export class LoginByEmail {
  @ApiProperty()
  emailAddress = '';
  @ApiProperty()
  password = '';
}
