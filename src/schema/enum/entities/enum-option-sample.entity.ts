import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ schema: 'ENUM', name: 'EnumOptionSample'})
export class EnumOptionSample extends BaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number; 

  @Column({ nullable: true })
  nameKW: string; 
}