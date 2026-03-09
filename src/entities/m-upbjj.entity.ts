import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity('m_upbjj')
export class MUpbjj {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ name: 'kode_upbjj', length: 10 })
    kodeUpbjj: string;

    @Field(() => Int, { nullable: true })
    @Column({ name: 'id_upbjj_sentra', nullable: true })
    idUpbjjSentra: number;

    @Field(() => Int, { nullable: true })
    @Column({ name: 'id_zona_waktu', nullable: true })
    idZonaWaktu: number;

    @Field()
    @Column({ name: 'nama_upbjj', length: 100 })
    namaUpbjj: string;

    @Field({ nullable: true })
    @Column({ name: 'alamat_upbjj', type: 'text', nullable: true })
    alamatUpbjj: string;

    @Field({ nullable: true })
    @Column({ name: 'nomor_telepon_upbjj', length: 50, nullable: true })
    nomorTeleponUpbjj: string;

    @Field({ nullable: true })
    @Column({ name: 'nomor_fax_upbjj', length: 50, nullable: true })
    nomorFaxUpbjj: string;

    @Field({ nullable: true })
    @Column({ name: 'email_upbjj', length: 100, nullable: true })
    emailUpbjj: string;

    @Field(() => Int)
    @Column({ name: 'status_aktif', default: 1 })
    statusAktif: number;

    @Field({ nullable: true })
    @Column({ name: 'web_upbjj', length: 255, nullable: true })
    webUpbjj: string;

    // Koordinat untuk peta
    @Field({ nullable: true })
    @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Field({ nullable: true })
    @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Field({ nullable: true })
    @Column({ name: 'created_by', length: 50, nullable: true })
    createdBy: string;

    @Field({ nullable: true })
    @Column({ name: 'updated_by', length: 50, nullable: true })
    updatedBy: string;

    @Field()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field({ nullable: true })
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

    // // Relations
    // @Field(() => [UserEntity], { nullable: true })
    // @OneToMany(() => UserEntity, user => user.upbjj)
    // users: UserEntity[];

}
