import { Column, Entity, Timestamp, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log_activity')
export class LogActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'log_date',
    nullable: true,
    type: 'timestamp',
  })
  logDate?: Timestamp;

  @Column({
    name: 'ip_address',
    nullable: true,
  })
  ipAddress?: string;

  @Column({
    name: 'comp_name',
    nullable: true,
  })
  compName?: string;

  @Column({
    name: 'user_id',
    nullable: true,
    type: 'int4',
  })
  userId?: number;

  @Column({
    name: 'modul_alias',
    nullable: true,
  })
  moduleAlias?: string;

  @Column({
    name: 'trans_id',
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  transId?: string;

  @Column({
    name: 'activity',
    nullable: true,
  })
  activity?: string;

  @Column({
    name: 'description',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'http_agent',
    nullable: true,
  })
  httpAgent?: string;

  @Column({
    name: 'http_host',
    nullable: true,
  })
  httpHost?: string;

  @Column({
    name: 'mac_address',
    nullable: true,
  })
  macAddress?: string;
}
