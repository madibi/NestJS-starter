import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckOut } from "./../models/classes/check-out.class";
import { RequestLimitationRepository } from "./../repositories/request-limitation.repository";

@Injectable()
export class RequestService {

  allowedIPs: string[];  
  disAllowedIPs: string[];  

  constructor(
    @InjectRepository(RequestLimitationRepository)
    private requestLimitationRepository: RequestLimitationRepository
  ) { 
    this.init();
  }

  public async update(): Promise<CheckOut> {
    const checkOut = new CheckOut();
    await this.getRequestLimitation();
    return checkOut;
  }


  // checkLimitationAchieved
  public isIPAllowed(ip: string): boolean {
    let status = true;
    if (this.allowedIPs.length && !this.allowedIPs.find((i) => i === ip)) {
      status = false;
    }
    return status;
  }

  public isIPDisAllowed(ip: string): boolean {
    let status = true;
    if (this.disAllowedIPs.length && !this.disAllowedIPs.find((i) => i === ip)) {
      status = false;
    }
    return status;
  }

  private async init() {
    return await this.getRequestLimitation();
  }

  private async getRequestLimitation(): Promise<void> {
    // const allowedIPs = await this.commonIPRepository.find({
    //   is_allow: true
    // });
    // const disAllowedIPs = await this.commonIPRepository.find({
    //   is_dis_allow: true
    // });    
    // this.allowedIPs = allowedIPs.map(ip => ip.ip);
    // this.disAllowedIPs = disAllowedIPs.map(ip => ip.ip);
  }
}