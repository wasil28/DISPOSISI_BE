import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
} from 'typeorm';

@Entity('_files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'file_name',
    type: 'text',
  })
  fileName: string;

  @Column({
    name: 'file_size',
    nullable: true,
  })
  fileSize: string;

  @Column({
    name: 'file_type',
    nullable: true,
  })
  fileType: string;

  @Column({
    name: 'file_name_origin',
    nullable: true,
  })
  fileNameOrigin: string;

  @Column({
    type: 'int2',
    nullable: true,
  })
  active: number;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
  })
  createdAt?: Timestamp;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Timestamp;
}
