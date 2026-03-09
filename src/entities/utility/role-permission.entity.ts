import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('t_role_permission')
@ObjectType()
export class RolePermission {
  @PrimaryGeneratedColumn()
  @Field((type) => Int, { nullable: true })
  id: number;

  @Column({
    name: 'role_id',
    type: 'int',
    nullable: false,
  })
  @Field((type) => Int, { nullable: false })
  roleId: number;

  @Column({
    name: 'permission_id',
    type: 'int',
    nullable: false,
  })
  @Field((type) => Int, { nullable: false })
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  @Field((type) => Role, { nullable: true })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  @Field((type) => Permission, { nullable: true })
  permission: Permission;
}
