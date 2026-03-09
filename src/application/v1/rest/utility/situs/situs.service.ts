import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SettingSitus } from 'src/entities/utility/setting-situs.entity';
import {
  SitusFilterPageableDto,
  UpdateSitusDto,
} from 'src/dto/utility/situs.dto';

@Injectable()
export class SitusService {
  constructor(
    @InjectRepository(SettingSitus)
    private situsRepository: Repository<SettingSitus>,
  ) {}

  async findAll(filter: SitusFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1;
      const itemsPerPage: number = filter.offset ?? 10;
      const conditions: string = filter.keyword ?? '';
      const orderBy: string = filter.orderBy ?? 'id';
      const order: string = filter.order ?? 'ASC';

      const [data, totalItems] = await this.situsRepository.findAndCount({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        where: [
          { kodePengaturan: ILike(`%${conditions}%`) },
          { nilaiPengaturan: ILike(`%${conditions}%`) },
          { keterangan: ILike(`%${conditions}%`) },
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

  async findOne(id: number) {
    try {
      return await this.situsRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    id: number,
    updateSitusDto: UpdateSitusDto,
  ): Promise<SettingSitus> {
    try {
      const situs = await this.situsRepository.findOneBy({ id: id });
      if (!situs) {
        return situs;
      }

      const mergedModule = this.situsRepository.merge(situs, updateSitusDto);
      await this.situsRepository.save(mergedModule);
      return situs;
    } catch (error) {
      throw new Error(error);
    }
  }
}
