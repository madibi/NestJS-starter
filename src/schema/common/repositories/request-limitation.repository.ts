import { Repository, EntityRepository } from 'typeorm';
import { RequestLimitation } from '../entities/request-limitation.entity';

@EntityRepository(RequestLimitation)
export class RequestLimitationRepository extends Repository<RequestLimitation> {
}