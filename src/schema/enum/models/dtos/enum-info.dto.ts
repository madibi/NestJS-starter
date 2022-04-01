import { Language } from '../../../common/entities/language.entity';
import { Role } from '../../../user/entities/role.entity';
import { Options } from './options.dto';

export class EnumInfo {
    options: Options;
    roles: Role[];  
    languages: Language[]; 
}