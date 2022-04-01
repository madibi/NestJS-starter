import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, Unique } from 'typeorm';

@Unique('endPointUniqueCode', ['code'])
@Unique('endPointUniqueController&Method&Verb', ["controller", "method", "verb"])
@Entity({ schema: 'COMMON', name: 'EndPoint' })
export class EndPoint extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  controller: string;

  @Column()
  method: string;  

  @Column()
  verb: string;    

  // code must be in 2power2 sequence, so we use in mix algorithm
  // in mix algorithm when we add numbers and get new number
  // then we can recognize numbers later
  @Column()
  code: string;      
}