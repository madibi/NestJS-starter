import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Image } from './../../../schema/common/entities/image.entity';

@Entity({ schema: 'USER', name: 'UserAvatar' })
export class UserAvatar extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, user => user.id, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @Column()
  userId: string;

  @OneToOne(() => Image, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
  @Column()
  imageId: string;
}
