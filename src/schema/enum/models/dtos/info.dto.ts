import { Language } from './../../../common/entities/language.entity';
import { Role } from './../../../user/entities/role.entity';
import { Option } from './option.dto';

export class Info {
    options: Option;
    roles: Role[];  
    languages: Language[]; 
}