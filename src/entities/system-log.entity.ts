import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_system_logs')
@ObjectType()
export class SystemLogEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    unsigned: true,
  })
  @Field((type) => ID, { nullable: true })
  id?: number;

  @Column({
    name: 'level',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Field((type) => String)
  level: string;

  @Column({
    name: 'source',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Field((type) => String)
  source: string;

  @Column({
    name: 'message',
    type: 'text',
    nullable: false,
  })
  @Field((type) => String)
  message: string;

  @Column({
    name: 'context',
    type: 'json',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  context?: any;

  @Column({
    name: 'trace',
    type: 'text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  trace?: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'timestamp',
  })
  @Field((type) => Date)
  timestamp: Date;
}
