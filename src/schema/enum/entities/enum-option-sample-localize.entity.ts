import { Language } from '@schema/common/entities/language.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { EnumOptionSample } from './enum-option-sample.entity';
                                 
@Entity({ schema: 'ENUM', name: 'EnumOptionSampleLocalize'})
export class EnumOptionSampleLocalize extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number; 

  @ManyToOne(() => EnumOptionSample, enumOptionSample => enumOptionSample.id, { eager: false })
  @JoinColumn({ name: 'enumOptionSampleId', referencedColumnName: 'id' })
  enumOptionSampleId: number;

  @ManyToOne(() => Language, language => language.id, { eager: false })
  @JoinColumn({ name: 'languageId', referencedColumnName: 'id' })
  languageId: number;

  @Column()
  name: string;   
}