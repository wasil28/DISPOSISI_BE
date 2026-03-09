import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { MenuEntity } from './menu.entity';

@Entity('t_otorisasi_menu')
@ObjectType()
export class OtorisasiMenuEntity extends BaseEntity {
  @ManyToOne(() => MenuEntity, (menu) => menu.otorisasi, {
    eager: true,
  })
  @JoinColumn({ name: 'id_menu' })
  @Field((type) => MenuEntity, { nullable: true })
  menu: MenuEntity;

  @ManyToOne(() => GroupEntity, (group) => group.menu)
  @JoinColumn({ name: 'id_group' })
  @Field((type) => GroupEntity, { nullable: true })
  group: GroupEntity;

  @Column({
    name: 'id_menu',
    type: 'int',
    nullable: false,
    unsigned: true,
  })
  @Field((type) => Int, { nullable: false })
  menuId: number;

  @Column({
    name: 'id_group',
    type: 'int',
    nullable: false,
    unsigned: true,
  })
  @Field((type) => Int, { nullable: false })
  groupId: number;

  @Column({
    name: 'status_aktif',
  })
  @Field((type) => Boolean, { nullable: true })
  statusAktif: boolean;
}
