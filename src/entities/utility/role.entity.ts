import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGeneralEntity } from '../user-general.entity';
import { ObjectType, Int, Field } from '@nestjs/graphql';
import { RolePermission } from './role-permission.entity';

@Entity('m_role')
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field((type) => Int, { nullable: true })
  id: number;

  @Column({
    name : 'nama_role',
    type: 'varchar',
    length: 20,
  })
  @Field((type) => String, { nullable: true })
  name: string;

  @Column({
    name : 'keterangan',
  })
  @Field((type) => String, { nullable: true })
  description: string;

  @Column({
    name: 'status_aktif',
    type: 'int2',
    nullable: true,
  })
  @Field((type) => Int, { nullable: true })
  active: number;

  @Column({
    name : 'kode_role',
    type: 'varchar',
    length: 10,
  })
  @Field((type) => String, { nullable: true })
  kode: string;

  @Column({
    name : 'kode_group_srs',
    type: 'varchar',
    length: 10,
  })
  @Field((type) => String, { nullable: true })
  kodeSrs: string;

  @ManyToMany(() => UserGeneralEntity, user => user.roles)
  @Field((type) => UserGeneralEntity, { nullable: true })
  users: UserGeneralEntity[];

  @Field((type) => Int, { nullable: true })
  idUpbjj?: number;

  @Field((type) => Int, { nullable: true })
  idFakultas?: number;

  @Field((type) => Int, { nullable: true })
  idProgramStudi?: number;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  @Field((type) => [RolePermission], { nullable: true })
  rolePermissions: RolePermission[];
}
