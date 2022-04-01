import { Repository, EntityRepository, getManager } from 'typeorm';
import { EnumOptionSample } from '../entities/enum-option-sample.entity';
import { Option } from './../models/dtos/option.dto';

@EntityRepository(EnumOptionSample)
export class EnumOptionSampleRepository extends Repository<EnumOptionSample> {
    async filterLanguage(languageId: number): Promise<Option[]> {
        return await getManager().query(`
        SELECT eos.id as id, eos."nameKW" as key, eosl."name" as value
        FROM "ENUM"."EnumOptionSample" as eos
        JOIN "ENUM"."EnumOptionSampleLocalize" as eosl
            ON eos."id" = eosl."enumOptionSampleId"
        where eosl."languageId" = $1
        `,[languageId]) as Option[];
    }    
}