import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LevelGroup } from 'src/resources/seeders/m_level_group.seeder';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
// import { LevelGroupEntity } from './level-group';
import { OtorisasiMenuEntity } from './otorisasi-menu.entity';
// import { UnitEntity } from './unit.entity';

@Entity('m_group')
@ObjectType()
export class GroupEntity extends BaseEntity {
  @Column({
    name: 'kode_group',
    nullable: false,
    unique: true,
  })
  @Field((type) => String, { nullable: false })
  kodeGroup: string;

  // @ManyToOne(() => UnitEntity, (unit) => unit.groups, { eager: true })
  // @JoinColumn({ name: 'id_unit' })
  // @Field((type) => UnitEntity, { nullable: false })
  // unit: UnitEntity;

  // @ManyToOne(() => LevelGroupEntity, { eager: true })
  // @JoinColumn({ name: 'id_level' })
  // @Field((type) => LevelGroupEntity, { nullable: false })
  // level: LevelGroupEntity;

  @OneToMany(
    () => OtorisasiMenuEntity,
    (otorisasiMenu) => otorisasiMenu.group,
    // {
    //   eager: true
    // }
  )
  @Field((type) => [OtorisasiMenuEntity], { nullable: true })
  menu: OtorisasiMenuEntity[];

  @Column({
    name: 'id_unit',
    nullable: false,
    unsigned: true,
  })
  @Field((type) => Int, { nullable: false })
  unitId: number;

  @Column({
    name: 'nama_group',
    nullable: false,
  })
  @Field((type) => String, { nullable: false })
  namaGroup: string;

  @Column({
    name: 'id_level',
  })
  @Field((type) => Int, { nullable: true })
  idLevel?: number;

  @Column({
    name: 'deskripsi',
    type: 'text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  deskripsi: string;
}
