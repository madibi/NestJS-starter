import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BeforeInsert, BaseEntity,
  Unique, Check, ManyToOne, JoinColumn, OneToMany, OneToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { Gender } from './gender.entity';
import { UserAvatar } from './user-avatar.entity';
import { Language } from './../../common/entities/language.entity';
import { EndPoint } from './../../common/entities/end-point.entity';
import { EndPointGroup } from './../../common/entities/end-point-group.entity';
import * as bcrypt from 'bcrypt';

@Unique('userUniquePhonePrefix&MobileNumber', ["phonePrefix", "mobileNumber"])
@Unique('userUniqueEmailAddress', ['emailAddress'])
@Unique('userUniqueUserName', ['userName'])
@Check(`SUBSTR("phonePrefix",1,1) = '+'`)
@Entity({ schema: 'USER', name: 'User' })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gender, (gender) => gender.id, { eager: false })
  @JoinColumn({ name: 'genderId', referencedColumnName: 'id' })
  @Column({ type: 'bigint', nullable: true })
  genderId: string;

  @Column({ unique: false, nullable: true })
  phonePrefix: string;

  @Column({ unique: false, nullable: true })
  mobileNumber: string;

  @Column({ unique: true, nullable: true })
  emailAddress: string;

  @Column({ unique: true, nullable: true })
  userName: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  isMobileNumberVerified?: boolean;

  @Column({ nullable: true })
  isEmailAddressVerified?: boolean;

  @Column({ nullable: true })
  bio?: string;

  @OneToOne(() => Language)
  @JoinColumn({ name: 'preferrerLanguageId', referencedColumnName: 'id' })
  @Column()
  preferrerLanguageId: string;
  
  @OneToMany(() => UserAvatar, userAvatar => userAvatar.userId)
  avatars: UserAvatar[];
  
  @ManyToMany(() => Role, (role) => role.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => EndPoint, (endPoint) => endPoint.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  claims: EndPoint[];  

  @ManyToMany(() => EndPointGroup, (endPointGroup) => endPointGroup.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  claimGroups: EndPointGroup[];    

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_OR_ROUNDS));
    } else {
      this.password = null;
    }
  }
}
