import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('t_billing_header', { schema: 'public' })
@ObjectType()
export class BillingHeader {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => ID)
  id: string;

  @Column({ name: 'id_masa', type: 'integer' })
  @Field(() => Int)
  idMasa: number;

  @Column({ name: 'nim', type: 'character', length: 9 })
  @Field(() => String)
  nim: string;

  @Column({ name: 'nobilling', type: 'character', length: 20 })
  @Field(() => String)
  nobilling: string;

  @Column({ name: 'id_sumber_data', type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  idSumberData?: number;

  @Column({ name: 'id_jenis_bayar', type: 'smallint', nullable: true })
  @Field(() => Int, { nullable: true })
  idJenisBayar?: number;

  @Column({ name: 'tanggalsetor', type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  tanggalSetor?: string;

  @Column({ name: 'totalsks', type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  totalSks?: number;

  @Column({ name: 'totalbayar', type: 'numeric', precision: 8, scale: 0, nullable: true })
  @Field(() => Number, { nullable: true })
  totalBayar: number;

  @Column({ name: 'id_status_billing', type: 'smallint', nullable: true })
  @Field(() => Int, { nullable: true })
  idStatusBilling?: number;

  @Column({ name: 'cabangbank', type: 'character varying', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  cabangBank?: string;

  @Column({ name: 'tanggalregistrasi', type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  tanggalRegistrasi?: string;

  @Column({ name: 'id_status_terbayar', type: 'smallint', default: 0 })
  @Field(() => Int)
  idStatusTerbayar: number;

  @Column({ name: 'id_mitra_transaksi', type: 'smallint', nullable: true })
  @Field(() => Int, { nullable: true })
  idMitraTransaksi?: number;

  @Column({ name: 'id_status_paket', type: 'smallint', nullable: true })
  @Field(() => Int, { nullable: true })
  idStatusPaket?: number;

  @Column({ name: 'nomorviraccount', type: 'character', length: 20, nullable: true })
  @Field(() => String, { nullable: true })
  nomorVirAccount?: string;

  @Column({ name: 'last_modified', type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  lastModified?: string;

  @Column({ name: 'created_by', type: 'character varying', length: 100, nullable: true })
  @Field(() => String)
  createdBy: string;

  @Column({ name: 'updated_by', type: 'character varying', length: 100, nullable: true })
  @Field(() => String)
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Column({ name: 'id_cmhs', type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  idCmhs?: number;

  @Column({ name: 'id_mhs', type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  idMhs?: number;

  @Column({ name: 'waktu_pembayaran', type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  waktuPembayaran?: Date;

  @Column({ name: 'masa', type: 'character', length: 5, nullable: true })
  @Field(() => String, { nullable: true })
  masa?: string;
}
