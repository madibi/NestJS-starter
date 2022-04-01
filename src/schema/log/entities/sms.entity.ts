import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity, } from 'typeorm';

@Entity({ schema: 'LOG', name: 'Sms' })
export class Sms extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true })
  phonePrefix: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  sendingType: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  date: Date;

  @BeforeInsert()
  async generateDate() {
    this.date = new Date();
  }
}
