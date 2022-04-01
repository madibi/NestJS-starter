import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckOut } from "./../models/classes/check-out.class";
import { IPRepository } from "./../repositories/ip.repository";

@Injectable()
export class IPService {

  allowedIPs: string[];  
  disAllowedIPs: string[];  

  constructor(
    @InjectRepository(IPRepository)
    private iPRepository: IPRepository
  ) { 
    this.init();
  }

  public async update(): Promise<CheckOut> {
    const checkOut = new CheckOut();
    await this.getAllowedAndDisAllowed();
    return checkOut;
  }

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
    return await this.getAllowedAndDisAllowed();
  }

  private async getAllowedAndDisAllowed(): Promise<void> {
    const allowedIPs = await this.iPRepository.find({
      isAllow: true
    });
    const disAllowedIPs = await this.iPRepository.find({
      isDisAllow: true
    });    
    this.allowedIPs = allowedIPs.map(ip => ip.ip);
    this.disAllowedIPs = disAllowedIPs.map(ip => ip.ip);
  }
}