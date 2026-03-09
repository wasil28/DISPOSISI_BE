import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('t_permission')
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn()
  @Field((type) => Int, { nullable: true })
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  @Field((type) => String, { nullable: false })
  code: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  description: string;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  @Field((type) => [RolePermission], { nullable: true })
  rolePermissions: RolePermission[];
}
