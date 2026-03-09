import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Modul } from 'src/entities/utility/modul.entity';
import { RolePriv } from 'src/entities/utility/role-priv.entity';
import { internalServerError } from 'src/infrastructure/utils/exception';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(RolePriv)
    private readonly rolePrivRepo: Repository<RolePriv>,
    @InjectRepository(Modul)
    private readonly modulRepo: Repository<Modul>,
  ) {}

  public async findMenu(
    groupId: number,
    kodeMenu: string,
  ): Promise<Modul[]> {
    try {
      const privs = await this.rolePrivRepo
        .createQueryBuilder('priv')
        .leftJoinAndSelect('priv.modules', 'modul')
        .where('priv.roleid = :groupId', { groupId })
        .andWhere('modul.alias = :kodeMenu', { kodeMenu })
        .getMany();

      return privs.map((p) => p.modules);
    } catch (error) {
      internalServerError(error);
    }
  }
}
