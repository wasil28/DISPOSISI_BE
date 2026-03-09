import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class ApiResponse {
  static success(data: any, totalItems = 0, totalPages = 0, currentPage = 0) {
    return {
      status: 200,
      message: 'success',
      data: data,
      meta: {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  static backupSuccess(data: any, totalBackupMonth = 0, completedBackupMonth = 0, totalBackupDay = 0, completedBackupToday = 0) {
    return {
      status: 200,
      message: 'success',
      data: data,
      meta: {
        totalBackupMonth: totalBackupMonth,
        completedBackupMonth: completedBackupMonth,
        totalBackupDay: totalBackupDay,
        completedBackupToday: completedBackupToday,
      },
    };
  }

  static badRequest(message?: string): BadRequestException {
    throw new BadRequestException({
      status: 400,
      message: message ?? 'Data Tidak Valid',
      data: null,
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
      },
    });
  }

  static notFound(): NotFoundException {
    throw new NotFoundException({
      status: 404,
      message: 'Data Tidak Tersedia',
      data: null,
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
      },
    });
  }

  static error(message: string): InternalServerErrorException {
    throw new InternalServerErrorException({
      status: 500,
      message: message,
      data: null,
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
      },
    });
  }
}
