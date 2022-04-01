import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, Unique, JoinTable } from 'typeorm';
import { EndPoint } from './end-point.entity';

@Unique('endPointGroupUniqueName', ['name'])
@Entity({ schema: 'COMMON', name: 'EndPointGroup' })
export class EndPointGroup extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;   

  @ManyToMany(() => EndPoint, (endPoint) => endPoint.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  endPoints: EndPoint[];
}