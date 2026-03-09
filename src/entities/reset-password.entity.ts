import {
  Column,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('t_reset_password_user')
export class ResetPasswordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  token: string;

  @Column({
    name: 'user_email',
  })
  userEmail: string;

  @Column({
    name: 'expired_at',
    default: new Date(new Date().getHours() + 48),
  })
  expiredAt: Date;

  @Column({
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;
}
