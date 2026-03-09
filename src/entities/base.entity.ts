import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    unsigned: true,
  })
  @Field((type) => ID, { nullable: true })
  id?: number;

  @Column({
    name: 'created_by',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  createdBy?: string;

  @Column({
    name: 'updated_by',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  updatedBy?: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  @Field((type) => Date, { nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  @Field((type) => Date, { nullable: true })
  updatedAt?: Date;

  // @DeleteDateColumn({
  //   type: 'timestamp',
  //   name: 'deleted_at'
  // })
  // @Field(type => Date, { nullable: true })
  // deletedAt?: Date;
}
