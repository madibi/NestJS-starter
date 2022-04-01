import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

@Entity({ schema: 'COMMON', name: 'Request' })
export class Request extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'bigint' })
  endPointId: string;

  @Column()
  date: Date;
}