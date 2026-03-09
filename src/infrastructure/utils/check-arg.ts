import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { AnyMxRecord } from 'dns';
import { existsSync, writeFile, appendFile } from 'fs';
import {
  DeleteResult,
  FindOneOptions,
  ILike,
  IsNull,
  Like,
  Not,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { PaginationPayload } from '../types/pagination.payload';
import { badRequestError, internalServerError } from './exception';

export function checkPagination(paginationPayload: PaginationPayload) {
  const paginate = {
    take: 10,
    skip: 0,
  };
  // if (!obj.limit) delete paginate.take;
  // if (!obj.skip) delete paginate.skip;
  // if (obj.skip) {
  //   paginate.skip = obj.skip;
  //   paginate.take = 10;
  // }
  paginate.take = paginationPayload.limit >= 0 ? paginationPayload.limit : 10;
  paginate.skip =
    !paginationPayload.skip || paginationPayload.skip <= 1
      ? 0
      : paginationPayload.skip * paginate.take - paginate.take;

  // const totalItems = data.count
  //   const totalPages = data.count == 0 ? 0 : Math.ceil(totalItems / limit)
  //   const currentPage = offset >= 1 ? data.page : 1
  return paginate;
}

export function checkPage(count: number, paginate: PaginationPayload) {
  const limit_take = checkPagination(paginate);
  const page = {
    totalItems: 0,
    currentPage: 0,
    totalPages: 1,
  };

  page.totalItems = count;
  page.totalPages =
    count == 0 || limit_take.take == 0
      ? 1
      : Math.ceil(page.totalItems / limit_take.take);
  page.currentPage = limit_take.skip >= 1 ? paginate.skip : 1;

  return page;
}

export function isCanGetData(obj: any, value: any, key?: string | number) {
  if (!obj) {
    if (!key) {
      throw new NotFoundException(`Data dengan id '${value}' tidak ditemukan.`);
    }
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan.`,
    );
  }
}

export function isCanUpdateData(obj: any, name: string) {
  if (obj.affected == 0) {
    throw new BadRequestException(`Gagal mengupdate ${name}`);
  }
}

export function checkFilterArg(obj: object): object {
  for (const [key, value] of Object.entries(obj)) {
    if (!value) {
      delete obj[key];
    }
  }

  return obj;
}

export function checkSortArg(sortBy: string, orderBy?: string) {
  const obj = {};
  sortBy = sortBy != null ? sortBy : 'ASC';
  orderBy = orderBy != null ? orderBy : 'id';
  obj[orderBy] = sortBy;
  return {
    order: {
      ...obj,
    },
  };
}

export async function validatePayload(obj: any) {
  const error = await validate(obj);
  if (error.length > 0) {
    for (const k of Object.keys(error[0].constraints)) {
      badRequestError(error[0].constraints[k]);
    }
  }
}

export function isCanDeleteData(
  obj: UpdateResult,
  value: any,
  key = 'id',
): void {
  if (obj?.affected === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan`,
    );
  }

  if (obj?.raw?.affectedRows === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan`,
    );
  }
}

export function isCanHardDeleteData(
  obj: DeleteResult,
  value: any,
  key = 'id',
): void {
  if (obj?.affected === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan / digunakan pada tabel yang ber-relasi`,
    );
  }

  if (obj?.raw?.affectedRows === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan / digunakan pada tabel yang ber-relasi`,
    );
  }
}

export function isCanRestoreData(
  obj: UpdateResult,
  value: any,
  key = 'id',
): void {
  if (obj?.affected === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan`,
    );
  }

  if (obj?.raw?.affectedRows === 0) {
    throw new NotFoundException(
      `Data dengan ${key} '${value}' tidak ditemukan`,
    );
  }
}

export function checkSearchArg(obj: any): object {
  const object = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!value) {
      delete obj[key];
    }

    if (typeof value == 'number' || typeof value == 'boolean') {
      object[key] = value;
    } else {
      object[key] = ILike(`%${value}%`);
    }
  }

  return object;
}

export function isDeletedOnly(deletedOnly = false, options?: FindOneOptions) {
  if (deletedOnly) {
    options.where['deletedAt'] = Not(IsNull());
    options.withDeleted = true;

    return options;
  }
}

// export function checkErrorDb(error: any) {
//   /*
//    * Error handling for unique constraint
//    */
//   if (error.code == 23505) {
//     const message = error.detail.split(' ');
//     const new_message = message[1].split('=');
//     const non_numeric = new_message[0].replace(/[^A-Za-z_]/g, '');
//     const value = new_message[1].replace(/[^A-Za-z0-9]/g, '');
//     const field = non_numeric.replace('_', ' ');
//     internalServerError(
//       `${field.charAt(0).toUpperCase() + field.slice(1)} ${value} sudah digunakan`,
//     );
//   }

//   /*
//    * Error handling for fk constraint
//    */
//   if (error.code == 23503) {
//     const message = error.detail.split(' ');
//     const new_message = message[1].split('=');
//     const non_numeric = new_message[0].replace(/[^A-Za-z_]/g, '');
//     const field = non_numeric.replace('_', ' ');
//     internalServerError(
//       `${field.charAt(0).toUpperCase() + field.slice(1)} tidak ada`,
//     );
//   }
// }

export function checkErrorDb(error: any) {
  /*
   * Error handling for unique constraint (Kode 23505)
   * Terjadi ketika ada duplikasi data pada kolom yang seharusnya unik
   */
  if (error.code == 23505) {
    const message = error.detail.split(' '); // Memecah pesan error menjadi array berdasarkan spasi
    const new_message = message[1].split('='); // Memisahkan key dan value berdasarkan '='
    const non_numeric = new_message[0].replace(/[^A-Za-z_]/g, ''); // Membersihkan nama kolom agar hanya huruf dan underscore
    const value = new_message[1].replace(/[^A-Za-z0-9]/g, ''); // Membersihkan nilai agar hanya huruf dan angka
    const field = non_numeric.replace('_', ' '); // Mengganti underscore dengan spasi agar lebih user-friendly

    // Mengirim pesan error yang jelas ke pengguna
    internalServerError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} ${value} sudah digunakan`,
    );
    return;
  }

  /*
   * Error handling for foreign key constraint (Kode 23503)
   * Terjadi ketika ada pelanggaran foreign key, seperti menghapus data yang masih direferensikan oleh tabel lain
   */
  if (error.code == 23503) {
    // Ekstraksi informasi dari pesan error
    const referencedTable = error.detail.match(/table "(.*?)"/)?.[1]; // Menangkap nama tabel referensi
    const columnName = error.detail.match(/Key \((.*?)\)/)?.[1]; // Menangkap nama kolom yang menyebabkan pelanggaran
    const value = error.detail.match(/\((.*?)\)=\((.*?)\)/)?.[2]; // Menangkap nilai spesifik yang melanggar constraint

    // Jika parsing berhasil, berikan pesan yang jelas ke pengguna
    if (referencedTable && columnName) {
      // internalServerError(
      //   `Id tersebut telah digunakan pada tabel ${referencedTable} di kolom ${columnName} dengan nilai ${value}`,
      // );
      internalServerError(
        `Data tidak dapat dihapus karena masih digunakan di table yang berelasi`,
      );
    } else {
      // Pesan fallback jika parsing tidak berhasil
      internalServerError('Terjadi pelanggaran constraint foreign key.');
    }
    return;
  }

  /*
   * Error handling for check constraint (Kode 23514)
   * Terjadi ketika data melanggar aturan check constraint di database
   */
  if (error.code == 23514) {
    // Pesan error spesifik dari detail check constraint
    const constraintName = error.constraint || 'constraint';
    internalServerError(
      `Data tidak valid: melanggar aturan ${constraintName}. Periksa kembali input Anda.`,
    );
    return;
  }

  /*
   * Default error handling untuk kode error lainnya
   * Menangani error yang tidak spesifik
   */
  // internalServerError(
  //   'Terjadi kesalahan pada database. Silakan coba lagi atau hubungi administrator.',
  // );
}


export const checkFiles = (path: string, data: any) => {
  if (!existsSync(path)) {
    writeFile(path, data, (err) => (err ? console.log(err) : undefined));
  } else {
    appendFile(path, data, (err) => (err ? console.log(err) : undefined));
  }
};

export async function checkRedisKeys(
  client: any,
  pattern: string,
  count?: number,
) {
  const key = await client.keys(pattern);
  if (key.length >= count) {
    return false;
  }
  return true;
}

export const existQueryHelper = <T>(builder: SelectQueryBuilder<T>) =>
  `NOT EXISTS (${builder.getQuery()})`;


// Fungsi Merge Search untuk menggabungkan objek secara rekursif
export function mergeEntries(baseObject, combinedObject) {
  const result = { ...baseObject };

  for (const key in combinedObject) {
    if (combinedObject[key] instanceof Object && key in result) {
      result[key] = {
        ...result[key],
        ...combinedObject[key]
      };
    } else {
      result[key] = combinedObject[key];
    }
  }

  return result;
}