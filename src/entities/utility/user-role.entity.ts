import { Column, JoinColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserGeneralEntity } from '../user-general.entity';
import { Role } from './role.entity';

@Entity('t_user_role')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'id_user',
    type: 'int2',
    nullable: true,
  })
  idUserGeneral: number;
  
  @Column({
    name: 'id_role',
    type: 'int2',
    nullable: true,
  })
  idRole: number;

  @Column({
    name: 'id_upbjj',
    type: 'int2',
    nullable: true,
  })
  idUpbjj: number;


  // Menambahkan relasi ManyToOne dengan entitas ProgramStudi melalui tabel perantara
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'id_role', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => UserGeneralEntity, user => user.userRoles)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: UserGeneralEntity;

}
