import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

export enum AppDirection {
  LTR = 'LTR',
  RTL = 'RTL'
}

@Unique('languageUniquePath', ['name'])
@Entity({ schema: 'COMMON', name: 'Language' })
export class Language extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  languageCode: string;

  @Column()
  languageLocale: string;

  @Column()
  phonePrefix: string;

  @Column()
  flagUrl: string;

  @Column()
  direction: AppDirection;

  @Column()
  dateType: string;

  public constructor(init?: Partial<Language>) {
    super();
    Object.assign(this, init);
  }
}