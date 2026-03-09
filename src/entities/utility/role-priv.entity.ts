import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Modul } from './modul.entity';
@Entity('t_otorisasi_role_modul')
export class RolePriv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'id_role',
  })
  roleid: number;
  
  @Column({
    name: 'id_modul',
  })
  moduleid: number;

  @Column({
    name: 'allow_view',
  })
  allowview: number;

  @Column({
    name: 'allow_new',
  })
  allownew: number;

  @Column({
    name: 'allow_edit',
  })
  allowedit: number;

  @Column({
    name: 'allow_delete',
  })
  allowdelete: number;

  @Column({
    name: 'allow_download',
  })
  allowdownload: number;

  @Column({
    name: 'allow_approve',
  })
  allowapprove: number;

  @OneToOne(() => Modul, (modul) => modul.id)
  @JoinColumn({ name: 'id_modul' })
  modules: Modul;
}
