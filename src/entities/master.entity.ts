import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@ObjectType()
export class MasterEntity extends BaseEntity {
  @Column({
    name: 'keterangan',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Field((type) => String, { nullable: true })
  keterangan?: string;
}
