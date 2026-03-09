import { Injectable } from '@nestjs/common';
import { ILike, Repository, EntityManager } from 'typeorm';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { CreateUserDto, UpdateUserDto, UserFilterPageableDto } from 'src/dto/utility/users.dto';
import { Role } from 'src/entities/utility/role.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';
import { internalServerError, notFoundError } from '../../../../../infrastructure/utils/exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserGeneralEntity) private userRepository: Repository<UserGeneralEntity>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async create(createUserDto: CreateUserDto,): Promise<UserGeneralEntity> {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
      });

      if(createUserDto.idPengembang != null && createUserDto.idPengembang != 0){
        const dtRole = await this.roleRepository.findOneBy({kode : 'RL10'})
        this.addRolePengembang(user.id)
        createUserDto.idPengembang = dtRole.id
      }

      // Default email verified nya true
      user.emailVerified = true
      
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUpbjj(idUpbjj: number, id: number){
  try {
      const result = await this.entityManager.query(`
          update t_user_role 
          set id_upbjj = $1
          where id = $2
          RETURNING *;
      `, [
          idUpbjj,
          id
      ]);
      
      if(!result){
        internalServerError('Gagal Simpan UPBJJ');
      }
      return result
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProgramStudi(idProdi: number, id: number){
    try {
      const result = await this.entityManager.query(`
          update t_user_role 
          set id_program_studi = $1
          where id = $2
          RETURNING *;
      `, [
          idProdi,
          id
      ]);
      if(!result){
        internalServerError('Gagal Simpan Program Studi');
      }
      return result
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateFakultas(idFakultas: number, id: number){
    try {
      const result = await this.entityManager.query(`
          update t_user_role 
          set id_fakultas = $1
          where id = $2
          RETURNING *;
      `, [
          idFakultas,
          id
      ]);
      if(!result){
        internalServerError('Gagal Simpan Fakultas');
      }
      return result
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filter: UserFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1; //Parameter page
      const itemsPerPage: number = filter.offset ?? 10; //Jumlah item per page
      const conditions: string = filter.keyword ?? '';
      const orderBy: string = filter.orderBy ?? 'id';
      const order: string = filter.order ?? 'ASC';

      // Ambil data & total items
      const [data, totalItems] = await this.userRepository.findAndCount({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        where: [
          { username: ILike(`%${conditions}%`) },
          { name: ILike(`%${conditions}%`) },
          { email: ILike(`%${conditions}%`) },
        ],
        order: {
          [orderBy]: order,
        },
        relations: {
          roles: true,
          userRoles: true
        },
      });

      // Total Pages
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return {
        data,
        totalItems,
        totalPages,
        page,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<UserGeneralEntity> {
    try {
      return await this.userRepository.findOne({
        where: { id: id },
        relations: {
          roles: true,
          userRoles: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<UserGeneralEntity> {
    try {
      return await this.userRepository.findOne({
        where: { email: email },
        relations: {
          roles: true,
          userRoles: true
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneMhsByEmail(email: string): Promise<UserGeneralEntity> {
    try {
      const dataMhs = await this.entityManager.query(`
        select 
          a.id,
          a.nama_user as name,
          a.username,
          a.email,
          a.status,
          null as firstName,
          null as lastName,
          null as prefix,
          a.nik,
          null as company,
          null as phone
        from m_users_kurikulum a
          join t_user_role b on b.id_user = a.id 
          join m_role c on c.id = b.id_role 
          left join m_biodata_mahasiswa d on d.id = a.id_mhs 
        where c.kode_role in ('RL10','RL11','RL12')
          and a.status = 1 
          and a.email_verified = true
          and a.email = $1
      `,[
        email
      ]);

      if(dataMhs.length == 0){
        notFoundError('user tidak terdaftar di aplikasi / user tidak aktif');
        return null
      }

      return dataMhs[0]
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserGeneralEntity> {
    try {
      const updated = await this.userRepository.save({
        id: id,
        ...updateUserDto,
        updatedBy: 'System App',
      });

      if(updateUserDto.idPengembang != null && updateUserDto.idPengembang != 0){
        const dtRole = await this.roleRepository.findOneBy({kode : 'RL10'})
        this.addRolePengembang(id)
        updateUserDto.idPengembang = dtRole.id
      }

      return await this.userRepository.findOne({
        where: {
          id: updated.id,
        }
      });
    }catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserGeneralEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: {
          roles: true,
        },
      });

      if (!user) {
        return user;
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);
      
      if (updateUserDto.roleIds) {
        const userRoleRepository: Repository<any> = this.entityManager.getRepository('UserRole');

        // Membuat objek data yang ingin Anda buat
        const newRoleData = {
            idUserGeneral: updatedUser.id,
            idRole: updateUserDto.roleIds,
        };

        // Jika data tidak ada, lakukan operasi insert
        const createdRole = await userRoleRepository.create(newRoleData);
        const inwsertedRole = await userRoleRepository.save(createdRole);

        // console.log(inwsertedRole)

        if(user.idGroup == null){
          const result = await this.entityManager.query(`
              update m_users_kurikulum 
              set id_role = $1
              where id = $2 
              RETURNING *;
          `, [
              newRoleData.idRole,
              user.id,
          ]);
          if(!result){
            internalServerError('Gagal Upadate ID ROLE');
          }
        }
        return inwsertedRole
      }
      return user
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) {
        return user;
      }

      return await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
  async removeUserRole(id: number): Promise<any> {
    try {
      const user = await this.userRoleRepository.findBy({ idUserGeneral: id });
      if (!user) {
        return user;
      }

      return await this.userRoleRepository.delete({ idUserGeneral: id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeUserRoleById(idUserRole: number): Promise<any> {
    try {
      const user = await this.userRoleRepository.findBy({ id: idUserRole });
      if (!user) {
        return user;
      }

      return await this.userRoleRepository.delete({ id: idUserRole });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addRolePengembang(id: number): Promise<any>{
    try {
      const dtRole = await this.roleRepository.findOneBy({kode : 'RL10'})
      const idRole = dtRole.id
      const roleFind = await this.userRoleRepository.findBy({idUserGeneral: id, idRole: idRole})

      if(roleFind.length == 0){
        const saveRole = await this.userRoleRepository.save({
          idUserGeneral: id,
          idRole: idRole
        })
        // console.log(saveRole)
        return saveRole
      }else{
        return []
      }

    } catch (error) {
      throw new Error(error);
    }
  }
}
