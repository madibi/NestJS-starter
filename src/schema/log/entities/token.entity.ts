import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from './../../user/entities/user.entity';

@Entity({ schema: 'LOG', name: 'Token' })
export class Token extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({type: 'uuid'})
  userId: string;

  @Column()
  ip: string;

  @Column()
  browseName: string;

  @Column()
  osName: string;

  @Column()
  cpuArchitecture: string;  

  @Column({ type: 'uuid' })
  appId: string;  

  @Column({ type: 'date', nullable: false }) 
  date: Date;

  @BeforeInsert()
  async setDate() {
      this.date = new Date();
  }   
}