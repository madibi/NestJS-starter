import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

@Unique('imageUniquePath', ['path'])
@Entity({ schema: 'COMMON', name: 'Image' })
export class Image extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  path: string;

  @Column({ nullable: true })
  width: number; // px

  @Column({ nullable: true })
  height: number; // px

  @Column({ nullable: true })
  averageColor: string; // hex with #

  @Column({ nullable: true })
  size: number; // byte

  @Column({ nullable: true })
  extension?: string;

  @Column({ nullable: true })
  mimeType?: string;
}