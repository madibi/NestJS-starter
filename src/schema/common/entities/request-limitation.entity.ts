import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

@Unique('commonUniqueEndPointId', ["endPointId"])
@Entity({ schema: 'COMMON', name: 'RequestLimitation' })
export class RequestLimitation extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  endPointId: string;

  @Column()
  numberPerMinute: number;

  @Column({ nullable: true })
  isDisabled: boolean;
}