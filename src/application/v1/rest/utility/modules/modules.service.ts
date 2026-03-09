import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Modul } from 'src/entities/utility/modul.entity';
import { ILike, Repository } from 'typeorm';
import {
  CreateModuleDto,
  UpdateModuleDto,
  ModuleFilterPageableDto,
} from 'src/dto/utility/modules.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modul)
    private moduleRepository: Repository<Modul>,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<Modul> {
    try {
      const modul = this.moduleRepository.create(createModuleDto);
      return await this.moduleRepository.save(modul);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filter: ModuleFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1;
      const itemsPerPage: number = filter.offset ?? 10;
      const conditions: string = filter.keyword ?? '';
      const orderBy: string = filter.orderBy ?? 'id';
      const order: string = filter.order ?? 'ASC';

      const [data, totalItems] = await this.moduleRepository.findAndCount({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        where: [
          { name: ILike(`%${conditions}%`) },
          { alias: ILike(`%${conditions}%`) },
          { url: ILike(`%${conditions}%`) },
        //   { group: ILike(`%${conditions}%`) },
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

  async findOne(id: number): Promise<Modul> {
    try {
      return await this.moduleRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateModuleDto: UpdateModuleDto): Promise<Modul> {
    try {
      const module = await this.moduleRepository.findOneBy({ id: id });
      if (!module) {
        return module;
      }

      const mergedModule = this.moduleRepository.merge(module, updateModuleDto);
      return await this.moduleRepository.save(mergedModule);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const module = await this.moduleRepository.findOneBy({ id: id });
      if (!module) {
        return module;
      }

      return await this.moduleRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
