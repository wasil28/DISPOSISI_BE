import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { isCanGetData } from 'src/infrastructure/utils/check-arg';
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from 'src/infrastructure/utils/exception';
import {
  FindOneOptions,
  FindOptionsWhere,
  getConnection,
  getRepository,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserGeneralEntity)
    private readonly userRepo: Repository<UserGeneralEntity>,

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
            ...where,
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
        select: ['id', 'email', 'name', 'password'],
      });
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
        id: id,
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
