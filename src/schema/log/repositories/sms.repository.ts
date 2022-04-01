import { Repository, EntityRepository } from 'typeorm';
import { Sms } from './../entities/sms.entity';

@EntityRepository(Sms)
export class SmsRepository extends Repository<Sms> {
}