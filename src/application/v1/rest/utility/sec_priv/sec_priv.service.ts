import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePriv } from 'src/entities/utility/role-priv.entity';
import { Modul } from 'src/entities/utility/modul.entity';
import { CreateSecPrivDto, SecPrivFilterPageableDto, UpdateSecPrivDto } from 'src/dto/utility/sec_priv.dto';

@Injectable()
export class SecPrivService {
  constructor(
    @InjectRepository(RolePriv) private secprivRepository: Repository<RolePriv>,
    @InjectRepository(Modul) private moduleRepository: Repository<Modul>
  ) {}

  async create(createSecPrivDto: CreateSecPrivDto): Promise<RolePriv> {
    try {
      const secpriv = this.secprivRepository.create(createSecPrivDto);
      return await this.secprivRepository.save(secpriv);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(filter: SecPrivFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1;
      const itemsPerPage: number = filter.offset ?? 10;
      const orderBy: string = filter.orderBy ?? 'roleId';
      const order: string = filter.order ?? 'ASC';

      const [data, totalItems] = await this.secprivRepository.findAndCount({
        take: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
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

  async findOne(roleId: number, filter: SecPrivFilterPageableDto) {
    try {
      const page: number = filter.start ?? 1;
      const itemsPerPage: number = filter.offset ?? 10;
      // const orderBy: string = filter.orderBy ?? 'roleId';
      // const order: string = filter.order ?? 'ASC';

      // const [data, totalItems] = await this.secprivRepository.findAndCount({
      //   where: [{ roleId: roleId }],
      // });

      // First Query
      const query1 = await this.secprivRepository
        .createQueryBuilder('a')
        .select([
          'a.id as idotorisasirole',
          'a.id_role as roleid',
          'b.id as moduleid',
          'b.nama_modul as name',
          'b.kode_modul as alias',
          'COALESCE(b.parent_id, 0) AS pid',
          'LTRIM(RTRIM(b.url)) AS url',
          'b.urutan as seq',
          'b.icon',
          'a.allow_view as allowView ',
          'a.allow_new as allowNew ',
          'a.allow_edit as allowEdit ',
          'a.allow_delete as allowDelete ',
          'a.allow_download as allowDownload ',
          'a.allow_approve as allowApprove ',
        ])
        .leftJoin('m_modul', 'b', 'a.id_modul = b.id')
        .where(`b.status_aktif = '1' AND a.allow_view = 1 AND a.id_role = :roleId`, {
          roleId,
        })
        .orderBy('b.kode_modul')
        .getRawMany();

      // Second Query
      const query2 = await this.moduleRepository
        .createQueryBuilder('m')
        .select([
          'null as idotorisasirole',
          'null as roleid',
          'm.id as moduleid',
          'm.name as name',
          'm.alias as alias',
          'COALESCE(m.parent_id, 0) AS pid',
          'LTRIM(RTRIM(m.url)) AS url',
          'm.urutan as seq',
          'm.icon',
          '0 AS allowView',
          '0 AS allowNew',
          '0 AS allowEdit',
          '0 AS allowDelete',
          '0 AS allowDownload',
          '0 AS allowApprove',
        ])
        .where(
          `m.status_aktif = '1' AND NOT EXISTS(` +
            'SELECT 1 FROM t_otorisasi_role_modul p WHERE p.id_modul = m.id AND p.allow_view = 1 AND p.id_role = :roleId' +
            ')',
          { roleId },
        )
        .getRawMany();

      // Combine results
      let data = query1.concat(query2);
      //console.log(data)

      // Fungsi pembanding untuk mengurutkan berdasarkan 'alias'
      const compareByAlias = (a, b) => {
        if (a.alias < b.alias) {
          return -1;
        }
        if (a.alias > b.alias) {
          return 1;
        }
        return 0;
      };

      data.sort(compareByAlias);

      // Calculate the total number of items
      const totalItems = data.length;

      // Total Pages
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return { data, totalItems, totalPages, page };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    roleId: number,
    updateSecPrivDto: UpdateSecPrivDto,
  ): Promise<RolePriv> {
    try {
      const role = await this.secprivRepository.findOneBy({
        roleid: roleId,
        moduleid: updateSecPrivDto.moduleid,
        id: updateSecPrivDto.id,
      });
      if (!role) {
        return role;
      }

      this.secprivRepository.merge(role, updateSecPrivDto);
      await this.secprivRepository.save(role);
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const role = await this.secprivRepository.findOneBy({ id: id });
      if (!role) {
        return role;
      }

      return await this.secprivRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
