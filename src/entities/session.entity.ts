import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChildEntity } from './child.entity';
import { UserGeneralEntity } from './user-general.entity';

@Entity({
  name: 't_sessions',
})
@ObjectType()
export class SessionEntity extends ChildEntity {
  @Column({
    name: 'user_id',
  })
  @Field((type) => Int, { nullable: false })
  userId?: number;

  @ManyToOne(() => UserGeneralEntity, (x) => x.sessions, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  @Field((type) => UserGeneralEntity, { name: 'userBssn', nullable: true })
  userGeneral?: UserGeneralEntity;

  @Column({
    type: 'varchar',
    length: '15',
    nullable: false,
    name: 'ip',
  })
  @Field((type) => String, { nullable: false })
  ip: string;

  @Column({
    type: 'char',
    length: '10',
    nullable: true,
    name: 'country',
  })
  @Field((type) => String, { nullable: true })
  country: string;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: true,
    name: 'city',
  })
  @Field((type) => String, { nullable: true })
  city: string;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: true,
    name: 'timezone',
  })
  @Field((type) => String, { nullable: true })
  timezone: string;

  @Column({
    type: 'int',
    nullable: true,
    name: 'latitude',
  })
  @Field((type) => Int, { nullable: true })
  latitude: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'longitude',
  })
  @Field((type) => Int, { nullable: true })
  longitude: number;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: false,
    name: 'browser',
  })
  @Field((type) => String, { nullable: false })
  browser: string;

  @Column({
    type: 'char',
    length: '10',
    nullable: true,
    name: 'browser_version',
  })
  @Field((type) => String, { nullable: true })
  browserVersion: string;

  @Column({
    type: 'varchar',
    length: '50',
    nullable: false,
    name: 'os',
  })
  @Field((type) => String, { nullable: false })
  os: string;

  @Column({
    type: 'char',
    length: '10',
    nullable: true,
    name: 'os_version',
  })
  @Field((type) => String, { nullable: true })
  osVersion: string;

  @Column({
    type: 'varchar',
    length: '50',
    nullable: false,
    name: 'device',
  })
  @Field((type) => String, { nullable: false })
  device: string;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: true,
    name: 'device_brand',
  })
  @Field((type) => String, { nullable: true })
  deviceBrand: string;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: true,
    name: 'device_model',
  })
  @Field((type) => String, { nullable: true })
  deviceModel: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'expired_at',
  })
  @Field((type) => Date, { nullable: false })
  expiredAt?: Date;

  isExpired?: any = () => new Date() > new Date(this.expiredAt);

  @Field((type) => Boolean, { nullable: true })
  isFirstLogin?: boolean;

  @Field((type) => Boolean, { nullable: true })
  isDefaultPassword?: boolean;
}
