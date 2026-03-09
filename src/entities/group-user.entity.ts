import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@ObjectType()
@Entity('t_group_user')
export class GroupUserEntity extends BaseEntity {
  @Column({
    name: 'id_aplikasi',
  })
  @Field((type) => Int, { nullable: true })
  idAplikasi: number;

  @Column({
    name: 'id_group',
  })
  @Field((type) => Int, { nullable: true })
  idGroup: number;

  @Column({
    name: 'id_user',
  })
  @Field((type) => Int, { nullable: true })
  idUser: number;
}
