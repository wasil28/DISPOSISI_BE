import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_modul')
export class Modul {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name : 'nama_modul',
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    name : 'kode_modul',
    type: 'varchar',
    length: 100,
  })
  alias: string;

  @Column()
  url: string;

  @Column({
    name: 'icon',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  iconCls?: string;

  @Column({
    name: 'urutan'
  })
  seq: number;

  @Column({
    name: 'parent_id'
  })
  pid: number;

  @Column({
    name : 'status_aktif',
    nullable: true,
  })
  publish?: number;

  @Column({
    name: 'nama_modul_inggris',
    type: 'varchar',
    length: 100,
  })
  nameEn: string;

  @Column({
    name: 'created_by',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  createdBy: string;
}
