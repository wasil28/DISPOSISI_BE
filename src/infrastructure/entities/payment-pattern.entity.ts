import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('t_payment_patterns')
@ObjectType()
export class PaymentPattern extends BaseEntity {
  @Column({
    name: 'pattern_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Field(() => String)
  patternName: string;

  @Column({
    name: 'regex_pattern',
    type: 'text',
    nullable: false,
  })
  @Field(() => String)
  regexPattern: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  @Field(() => Boolean)
  isActive: boolean;

  @Column({
    name: 'priority',
    type: 'integer',
    default: 0,
    nullable: false,
  })
  @Field(() => Int)
  priority: number;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
