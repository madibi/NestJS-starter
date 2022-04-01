import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckOutObject } from "./../../common/models/classes/check-out-object.class";
import { TokenRepository } from "../repositories/token.repository";
import { Token } from "../entities/token.entity";

@Injectable()
export class TokenService {

  constructor(
    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,
  ) { }

  public async create(
    userId: string,
    ip: string,
    browseName: string,
    osName: string,
    cpuArchitecture: string,
    appId,
  ): Promise<CheckOutObject<Token>> {
    let checkOutObject = new CheckOutObject<Token>();
    checkOutObject.object = await this.tokenRepository.save(this.tokenRepository.create({
      userId,
      ip,
      browseName,
      osName,
      cpuArchitecture,
      appId,
    }));
    return checkOutObject;
  }
}