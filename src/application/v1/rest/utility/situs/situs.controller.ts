import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { SitusService } from './situs.service';
import { LoggerService } from 'src/config/logger-file.config';
import {
  SitusFilterPageableDto,
  UpdateSitusDto,
} from 'src/dto/utility/situs.dto';
import { ApiResponse } from 'src/commons/response/response.util';
import { ApiTags } from '@nestjs/swagger';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';
import { UseGuards } from '@nestjs/common';

@Controller('/api/v1/situs')
@ApiTags('Setting Situs')
export class SitusController {
  constructor(
    private readonly situsService: SitusService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.situs.view')
  async findAll(@Query() filter: SitusFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.situsService.findAll(filter);

      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      this.logger.error('Gagal mengambil data situss.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @Get(':id')
  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.situs.view')
  async findOne(@Param('id') id: string) {
    try {
      const situs = await this.situsService.findOne(+id);

      if (!situs) {
        throw new NotFoundException();
      }

      return ApiResponse.success(situs);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data situs.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @Patch(':id')
  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.situs.update')
  async update(
    @Param('id') id: string,
    @Body() updateSitusDto: UpdateSitusDto,
  ) {
    try {
      const situs = await this.situsService.update(+id, {
        nilaiPengaturan: updateSitusDto.nilaiPengaturan?.trim(),
        keterangan: updateSitusDto.keterangan?.trim(),
      });

      if (!situs) {
        throw new NotFoundException();
      }

      return ApiResponse.success(situs);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal memperbarui data situs.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }
}
