import { IsNotEmpty, MinLength } from "./../../../../packages/class-validator";

export class SetCacheRQ {
  @MinLength(3)
  @IsNotEmpty()
  public key: string;  
  @MinLength(3)
  public value: string;  
  public ttl?: number;  
}


