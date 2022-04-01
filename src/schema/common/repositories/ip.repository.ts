import { Repository, EntityRepository } from 'typeorm';
import { IP } from './../entities/ip.entity';

@EntityRepository(IP)
export class IPRepository extends Repository<IP> {
}