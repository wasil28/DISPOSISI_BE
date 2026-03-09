import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './utility/role.entity';
import { UserRole } from './utility/user-role.entity';
import { BaseEntity } from './base.entity';
import { SessionEntity } from './session.entity';

@Entity('m_users')
@ObjectType()
export class UserGeneralEntity extends BaseEntity {
  @OneToMany(() => SessionEntity, (session) => session.userGeneral)
  @Field((type) => [SessionEntity], { nullable: true })
  sessions?: SessionEntity[];

  @Column({
    name: 'id_role',
    type: 'int',
    nullable: true,
  })
  @Field((type) => Int, { nullable: true })
  idGroup?: number;


  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Field((type) => String, { nullable: true })
  email?: string;

  @Column({
    name: 'email_verified',
    nullable: true,
  })
  @Field((type) => Boolean, { nullable: true })
  emailVerified?: boolean;

  @Column({
    name: '365_account'
  })
  @Field(type => String, { nullable: true })
  ecampusAccount?: string;

  @Column({
    name: 'nama_user',
    type: 'varchar',
    nullable: false,
  })
  @Field((type) => String, { nullable: false })
  name?: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password?: string;

  @Column({
    name: 'username',
    type: 'varchar',
    nullable: false,
  })
  @Field((type) => String, { nullable: true })
  username?: string;

  @Column({
    name: 'kode_aktifasi_akun',
    type: 'varchar',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  kodeAktifasiAkun?: string;

  @Column({
    name: 'kode_lupa_password',
    type: 'varchar',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  kodeLupaPassword?: string;

  @Column({
    name: 'kadaluarsa_lupa_password',
    type: 'timestamp',
    nullable: true,
  })
  @Field((type) => Date, { nullable: true })
  kadaluarsaLupaPassword?: Date;

  @Column({
    name: 'status',
    type: 'int',
    nullable: true,
  })
  @Field((type) => Int, { nullable: false })
  status?: number;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 't_user_role', // Nama tabel perantara
    joinColumn: { name: 'id_user', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_role', referencedColumnName: 'id' },
  })
  @Field((type) => [Role], { nullable: true })
  roles: Role[];

}
