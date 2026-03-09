import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class ChildEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    unsigned: true,
  })
  @Field((type) => ID, { nullable: false })
  id?: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  @Field((type) => Date)
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  @Field((type) => Date,{ nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
  })
  @Field((type) => Date, { nullable: true })
  deletedAt?: Date;
}
