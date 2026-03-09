import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MenuEntity } from "./menu.entity";

@Entity('m_aplikasi')
@ObjectType()
export class AplikasiEntity extends BaseEntity {
  
  @OneToMany(() => MenuEntity, menu => menu.aplikasi)
  @Field(type => [MenuEntity], { nullable: true })
  menu: MenuEntity[];

  @Column({
    name: 'kode_aplikasi',
    unique: true,
    nullable: false
  })
  @Field(type => String, { nullable: false })
  kodeAplikasi: string;

  @Column({
    name: 'nama',
    nullable: false
  })
  @Field(type => String, { nullable: false })
  nama: string;

  @Column({
    name: 'nama_singkat',
    nullable: false
  })
  @Field(type => String, { nullable: true })
  nama_singkat: string;

  @Column({
    name: 'icon',
    nullable: false,
    array: true,
    type: "text",
  })
  @Field(type => [String], { nullable: false })
  icon: string[];
  
  @Column({
    name: 'color',
    nullable: true,
    length: 7
  })
  @Field(type => String, { nullable: true })
  color: string;

  @Column({
    name: 'deskripsi',
  })
  @Field(type => String, { nullable: true })
  deskripsi: string;

  @Column({
    name: 'url'
  })
  @Field(type => String, { nullable: true })
  url: string;

}
