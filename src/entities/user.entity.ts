import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { SessionEntity } from './session.entity';
import { UserRole } from './utility/user-role.entity';

@Entity('m_users')
@ObjectType()
export class UserEntity extends BaseEntity {

  @OneToMany(() => SessionEntity, (sessions) => sessions.userGeneral)
  @Field((type) => [SessionEntity], { nullable: true })
  sessions?: SessionEntity[];

  @ManyToOne(() => GroupEntity, { eager: true })
  @JoinColumn({ name: 'id_role' })
  @Field((type) => GroupEntity)
  group?: GroupEntity;

  @Column({
    name: 'id_role',
    type: 'int',
    nullable: false,
  })
  @Field((type) => Int, { nullable: false })
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
    name: 'nama_user',
    type: 'varchar',
    nullable: false,
  })
  @Field((type) => String, { nullable: true })
  name?: string;

  @Column({
    name: '365_account',
  })
  @Field((type) => String, { nullable: true })
  ecampusAccount?: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password?: string;


  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];
  
}
