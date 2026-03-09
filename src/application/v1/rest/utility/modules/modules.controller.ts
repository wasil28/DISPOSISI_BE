import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiResponse } from 'src/commons/response/response.util';
import {
  CreateModuleDto,
  UpdateModuleDto,
  ModuleFilterPageableDto,
  ModulSuccessDeleteResponse,
  ModulSuccessResponse,
  ModulSuccessPageableResponse,
} from 'src/dto/utility/modules.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerService } from 'src/config/logger-file.config';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';

@Controller('api/v1/modules')
@ApiTags('Modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.modules.create')
  @Post()
  @ApiOperation({
    summary: 'Menambah modul baru',
    description: 'Menambahkan modul baru.',
  })
  @ApiCreatedResponse({
    type: ModulSuccessResponse,
  })
  async create(@Body() createModuleDto: CreateModuleDto) {
    try {
      const modul = await this.modulesService.create({
        ...createModuleDto,
        name: createModuleDto.name.trim(),
        alias: createModuleDto.alias.trim(),
        url: createModuleDto.url.trim(),
        iconCls: createModuleDto.iconCls.trim(),
        nameEn: createModuleDto.nameEn.trim(),
        createdBy: 'superadmin'
      });
      return ApiResponse.success(modul);
    } catch (error) {
      this.logger.error('Gagal membuat modul.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.modules.view')
  @Get()
  @ApiOperation({
    summary: 'Mengambil daftar / list dari modul',
    description: 'Mengambil daftar / list dari modul.',
  })
  @ApiOkResponse({
    type: ModulSuccessPageableResponse,
  })
  async findAll(@Query() filter: ModuleFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.modulesService.findAll(filter);

      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      this.logger.error('Gagal mengambil data modul.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.modules.view')
  @Get(':id')
  @ApiOperation({
    summary: 'Mengambil data modul',
    description: 'Mengambil data modul berdasarkan id dari modul.',
  })
  @ApiOkResponse({
    type: ModulSuccessResponse,
  })
  async findOne(@Param('id') id: string) {
    try {
      const modul = await this.modulesService.findOne(+id);
      if (!modul) {
        throw new NotFoundException();
      }

      return ApiResponse.success(modul);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data modul.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.modules.update')
  @Patch(':id')
  @ApiOperation({
    summary: 'Memperbarui data modul',
    description: 'Memperbarui data modul berdasarkan id modul.',
  })
  @ApiOkResponse({
    type: ModulSuccessResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    try {
      const modul = await this.modulesService.update(+id, {
        ...updateModuleDto,
        name: updateModuleDto.name?.trim(),
        alias: updateModuleDto.alias?.trim(),
        url: updateModuleDto.url?.trim(),
        iconCls: updateModuleDto.iconCls?.trim(),
        nameEn: updateModuleDto.nameEn?.trim(),
      });
      if (!modul) {
        throw new NotFoundException();
      }

      return ApiResponse.success(modul);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal memperbarui data modul.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.modules.delete')
  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus data modul',
    description: 'Menghapus data modul berdasarkan id modul.',
  })
  @ApiOkResponse({
    type: ModulSuccessDeleteResponse,
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.modulesService.remove(+id);
      if (!result) {
        throw new NotFoundException();
      }

      return ApiResponse.success('Berhasil menghapus data modul');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal menghapus data modul.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }
}
