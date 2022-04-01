import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, Unique } from 'typeorm';

@Unique('userUniqueRoleName', ['name'])
@Entity({ schema: 'USER', name: 'Role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({unique: true, nullable: false})
  key: string; 

  @Column()
  name: string;
}