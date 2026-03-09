import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AplikasiEntity } from './aplikasi.entity';
import { BaseEntity } from './base.entity';
import { OtorisasiMenuEntity } from './otorisasi-menu.entity';

@Entity('m_menu_aplikasi')
@ObjectType()
export class MenuEntity extends BaseEntity {
  @ManyToOne(() => AplikasiEntity, (aplikasi) => aplikasi.menu)
  @JoinColumn({ name: 'id_aplikasi' })
  @Field((type) => AplikasiEntity, { nullable: true })
  aplikasi?: AplikasiEntity;

  @OneToMany(() => OtorisasiMenuEntity, (otorisasiMenu) => otorisasiMenu.menu)
  @Field((type) => [OtorisasiMenuEntity], { nullable: true })
  otorisasi: OtorisasiMenuEntity[];

  @Column({
    name: 'kode_menu',
    type: 'char',
    length: 7,
  })
  @Field((type) => String, { nullable: true })
  kodeMenu: string;

  @Column({
    name: 'id_aplikasi',
    type: 'int',
    unsigned: true,
    nullable: false,
  })
  @Field((type) => Int, { nullable: false })
  aplikasiId: number;

  @Column({
    name: 'nama_menu',
    nullable: false,
  })
  @Field((type) => String, { nullable: false })
  namaMenu: string;

  @Column({
    name: 'parent_id',
    type: 'char',
    length: 7,
    nullable: false,
  })
  @Field((type) => String, { nullable: true })
  parentId: string;

  @Column({
    name: 'icon',
    nullable: false,
  })
  @Field((type) => String, { nullable: false })
  icon: string;

  @Column({
    transformer: {
      from: (value) => value,
      to: (value) => (value === '1' ? true : false),
    },
    name: 'status_qc',
  })
  @Field((type) => Boolean, { nullable: false })
  statusQC?: boolean;

  @Column({
    name: 'qc_by',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  qcBy?: string;

  @Column({
    name: 'qc_at',
    nullable: true,
    type: 'timestamp',
  })
  @Field((type) => Date, { nullable: true })
  qcAt?: Date;

  @Column({
    name: 'keterangan',
    type: 'text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  keterangan: string;

  @Column({
    name: 'link',
    type: 'text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  link: string;

  // public isSubMenu(): boolean {
  //   return this.parentId < 1 && this.parentId == 0;
  // }

  public isQCPassed? = (): boolean => {
    return this.statusQC && this.qcAt !== null && this.qcBy !== null;
  };
}
