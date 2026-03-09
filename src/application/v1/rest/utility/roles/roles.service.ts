import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { Role } from 'src/entities/utility/role.entity';
import {
  CreateRoleDto,
  RoleFilterPageableDto,
  UpdateRoleDto,
} from 'src/dto/utility/roles.dto';
import { internalServerError } from 'src/infrastructure/utils/exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filter: RoleFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1;
      const itemsPerPage: number = filter.offset ?? 10;
      const conditions: string = filter.keyword ?? '';
      const orderBy: string = filter.orderBy ?? 'id';
      const order: string = filter.order ?? 'ASC';

      const [data, totalItems] = await this.roleRepository.findAndCount({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        where: [
          { name: ILike(`%${conditions}%`) },
          { description: ILike(`%${conditions}%`) },
          { kode: ILike(`%${conditions}%`) },
        ],
        order: {
          [orderBy]: order,
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
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOne({ 
        where: { id: id },
        relations: ['rolePermissions']
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ id: id });
      if (!role) {
        return role;
      }

      const mergedRole = await this.roleRepository.merge(role, updateRoleDto);
      return await this.roleRepository.save(mergedRole);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const role = await this.roleRepository.findOneBy({ id: id });
      if (!role) {
        return role;
      }

      return await this.roleRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getKodeRoleBaru(){
    try {
      const query = this.entityManager.query(`
        select concat('RL',
          right(concat('00',cast(cast(max(right(a.kode_role,2)) as integer)+1 as varchar)), 2)) as kode_role_baru
        from m_role a WHERE right(a.kode_role, 2) ~ '^[0-9]+$'`)
        
      return query
    } catch (error) {
      internalServerError(error);
    }
  }

  async assignPermissions(id: number, permissionIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
        // 1. Delete existing
        await manager.delete('t_role_permission', { roleId: id });

        // 2. Insert new
        if (permissionIds.length > 0) {
            const values = permissionIds.map(permId => ({
                roleId: id,
                permissionId: permId
            }));
            await manager.createQueryBuilder()
                .insert()
                .into('t_role_permission')
                .values(values)
                .execute();
        }
    });
  }

}
