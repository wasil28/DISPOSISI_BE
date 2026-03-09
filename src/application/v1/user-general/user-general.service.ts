import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import {
  badRequestError,
  internalServerError,
} from 'src/infrastructure/utils/exception';
import {
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { GroupUserEntity } from 'src/entities/group-user.entity';

@Injectable()
export class UserGeneralService {
  constructor(
    @InjectRepository(UserGeneralEntity) private readonly userRepo: Repository<UserGeneralEntity>, 
    @InjectRepository(OtorisasiMenuEntity) private readonly otMenuRepo: Repository<OtorisasiMenuEntity>,
    
  ) {}

  async findOne(
    where?: FindOptionsWhere<UserGeneralEntity>,
    select?: FindOneOptions<UserGeneralEntity>,
    defaultReturn = true,
  ) {
    try {
      if (!select) {
        const user = await this.userRepo.findOne({
          where,
        });
        return user;
      } else {
        const user = await this.userRepo.findOne(
          {
            where: where,
            select: select.select,
          },
        );
        if (defaultReturn) {
          if (!user) badRequestError('Periksa kembali email/kata sandi anda');
        }
        return user;
      }
    } catch (error) {
      internalServerError(error);
    }
  }

  async getById(id: number) {
    try {
      return await this.userRepo.findOne({
        where: {
          id: id
        },
        select: ['id', 'email', 'name', 'password', 'idGroup', 'ecampusAccount'],
      });
    } catch (error) {
      internalServerError(error);
    }
  }

  async getAplikasi({ idGroup, id }: UserGeneralEntity) {
    const aplikasi1 = await this.otMenuRepo
      .createQueryBuilder('otorisasi')
      .leftJoinAndSelect('otorisasi.menu', 'menu')
      .leftJoinAndSelect('menu.aplikasi', 'aplikasi')
      .leftJoinAndSelect(
        GroupUserEntity,
        'gu',
        'gu.idAplikasi = aplikasi.id and gu.idGroup = otorisasi.groupId',
      )
      .where('gu.idUser = :idUser', { idUser: id })
      .distinctOn(['aplikasi'])
      .getMany();

    return aplikasi1.map((a) => a.menu.aplikasi);
  }

  async getParentMenu(
    idUser: number,
    idAplikasi: number,
  ): Promise<OtorisasiMenuEntity[]> {
    try {
      const parent_menus = await this.otMenuRepo
        .createQueryBuilder('om')
        .leftJoinAndSelect('om.menu', 'menu')
        .leftJoinAndSelect('menu.aplikasi', 'aplikasi')
        .leftJoinAndSelect(
          GroupUserEntity,
          'gu',
          'gu.idAplikasi = aplikasi.id and gu.idGroup = om.groupId',
        )
        .where('gu.idUser = :idUser', { idUser })
        .andWhere('menu.parentId = :parentId', { parentId: '0' })
        .andWhere('menu.aplikasiId = :idAplikasi', { idAplikasi })
        .andWhere('om.statusAktif = true')
        .getMany();

      return parent_menus;
    } catch (error) {
      internalServerError(error);
    }
  }

  async getSubMenu(idUser: number, idAplikasi: number, parentId: string) {
    try {
      const child_menus = await this.otMenuRepo
        .createQueryBuilder('om')
        .leftJoinAndSelect('om.menu', 'menu')
        .leftJoinAndSelect('menu.aplikasi', 'aplikasi')
        .leftJoinAndSelect(
          GroupUserEntity,
          'gu',
          'gu.idAplikasi = aplikasi.id and gu.idGroup = om.groupId',
        )
        .where('gu.idUser = :idUser', { idUser })
        .andWhere('menu.parentId = :parentId', { parentId })
        .andWhere('menu.aplikasiId = :idAplikasi', { idAplikasi })
        .andWhere('om.statusAktif = true')
        .distinctOn(['menu.namaMenu'])
        .getMany();

      return await Promise.all(
        child_menus.map(async ({ menu }) => {
          return {
            ...menu,
            submenu: await this.getSubMenu(idUser, idAplikasi, menu.kodeMenu),
          };
        }),
      );
    } catch (error) {
      internalServerError(error);
    }
  }

  async updateUser(id: number, payload: UserGeneralEntity) {
    try {
      payload.password = hashSync(
        payload.password,
        process.env.SALT_ROUND || 12,
      );
      const user = await this.userRepo.update(id, { ...payload });
      return user;
    } catch (error) {
      internalServerError(error);
    }
  }

  async isFirstLogin(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: id
      },
      relations: ['sessions'],
      cache: true,
    });

    return user.sessions.length;
  }

 

  async update(id: number, options: any) {
    return await this.userRepo.update(id, {
      ...options,
    });
  }

  isDefaultPassword(hashedPassword: string): boolean {
    const DEFAULT_PASSWORD = '123456';
    return compareSync(
      DEFAULT_PASSWORD,
      this.converHashToBcrypt(hashedPassword),
    );
  }

  converHashToBcrypt(hashedPassword: string) {
    if (hashedPassword.slice(0, 3) === '$2y')
      return hashedPassword.replace(/^\$2y(.+)$/i, '$2a$1');
    return hashedPassword;
  }
}
