import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

@Unique('genderUniqueName', ['name'])
@Entity({ schema: 'USER', name: 'Gender' })
export class Gender extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;
}