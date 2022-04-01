import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Check } from 'typeorm';

@Check('ipAllowOrDisAllow', 
  `("isAllow" = 'true' AND "isDisAllow" != 'true') OR ("isDisAllow" = 'true' AND "isAllow" != 'true')`)
@Entity({ schema: 'COMMON', name: 'IP' })
export class IP extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  ip: string;

  @Column({ nullable: true })
  isAllow: boolean;

  @Column({ nullable: true })
  isDisAllow: boolean;
}