import { Token } from './token.dto';

export class VerifyCodeRS {
  status = true;
  message: string;
  token?: Token = undefined;
}
