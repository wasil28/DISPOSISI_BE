import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('t_bank_mutasi')
@ObjectType()
@Index('idx_bank_mutasi_status', ['status'], { where: '"deleted_at" IS NULL' })
@Index('idx_bank_mutasi_ref', ['referenceNo'])
export class BankMutasi extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  @Field(() => ID)
  id: number;

  @Column({
    name: 'reference_no',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  @Field(() => String)
  referenceNo: string;

  @Column({
    name: 'account_no',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  accountNo?: string;

  @Column({
    name: 'trx_date',
    type: 'timestamp',
    nullable: false,
  })
  @Field(() => Date)
  trxDate: Date;

  @Column({
    name: 'journal_seq',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  journalSeq?: string;

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 18,
    scale: 2,
    nullable: false,
  })
  @Field(() => Number)
  amount: number;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({
    name: 'id_billing_header',
    type: 'bigint',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  idBillingHeader?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'NEW',
    nullable: false,
  })
  @Field(() => String)
  status: string;

  @Column({
    name: 'processing_log',
    type: 'text',
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  processingLog?: string;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
