import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_pengaturan_portal')
export class SettingSitus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'kode_pengaturan'
  })
  kodePengaturan: string;

  @Column({
    name: 'nilai_pengaturan'
  })
  nilaiPengaturan: string;

  @Column({
    name : 'keterangan'
  })
  keterangan: string;
}
