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
import { RolesService } from './roles.service';
import { LoggerService } from 'src/config/logger-file.config';
import {
  CreateRoleDto,
  RoleFilterPageableDto,
  UpdateRoleDto,
  RoleSuccessResponse,
  RoleSuccessPageableResponse,
  RoleSuccessDeleteResponse,
  AssignPermissionsDto,
} from 'src/dto/utility/roles.dto';
import { ApiResponse } from 'src/commons/response/response.util';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';
import { Put } from '@nestjs/common';

@Controller('/api/v1/roles')
@ApiTags('Roles')
@ApiBearerAuth()
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.update')
  @Put(':id/permissions')
  @ApiOperation({
    summary: 'Assign Permissions to Role',
    description: 'Mengupdate permission yang dimiliki oleh Role.',
  })
  @ApiOkResponse({
    description: 'Sukses update permission',
  })
  async updatePermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto) {
    try {
      await this.rolesService.assignPermissions(+id, dto.permissionIds);
      return ApiResponse.success('Berhasil update permission');
    } catch (error) {
      this.logger.error('Gagal update permission.', error);
      return ApiResponse.error(error.message);
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.create')
  @Post('')
  @ApiOperation({
    summary: 'Menambah role baru',
    description: 'Menambahkan role baru.',
  })
  @ApiCreatedResponse({
    type: RoleSuccessResponse,
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      // Create Kode Mitra
      let kode
      const kodeRole = await this.rolesService.getKodeRoleBaru()
      if(kodeRole.length > 0 ){
        kode = kodeRole[0]['kode_role_baru'] 
      }else{
        kode = `RL01`
      }

      const role = await this.rolesService.create({
        ...createRoleDto,
        active: createRoleDto.active ?? 1,
        name: createRoleDto.name.trim(),
        description: createRoleDto.description.trim(),
        kode: kode,
      });

      return ApiResponse.success(role);
    } catch (error) {
      this.logger.error('Gagal membuat role.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.view')
  @Get()
  @ApiOperation({
    summary: 'Mengambil daftar / list dari role',
    description: 'Mengambil daftar / list dari role.',
  })
  @ApiOkResponse({
    type: RoleSuccessPageableResponse,
  })
  async findAll(@Query() filter?: RoleFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.rolesService.findAll(filter);

      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      this.logger.error('Gagal mengambil data roles.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.view')
  @Get(':id')
  @ApiOperation({
    summary: 'Mengambil data role',
    description: 'Mengambil data role berdasarkan id dari role.',
  })
  @ApiOkResponse({
    type: RoleSuccessResponse,
  })
  async findOne(@Param('id') id: string) {
    try {
      const role = await this.rolesService.findOne(+id);
      if (!role) {
        throw new NotFoundException();
      }

      return ApiResponse.success(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data role.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.update')
  @Patch(':id')
  @ApiOperation({
    summary: 'Memperbarui data role',
    description: 'Memperbarui data role berdasarkan id role.',
  })
  @ApiOkResponse({
    type: RoleSuccessResponse,
  })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesService.update(+id, {
        ...updateRoleDto,
        name: updateRoleDto.name?.trim(),
        description: updateRoleDto.description?.trim(),
        kode: updateRoleDto.kode?.trim(),
      });
      if (!role) {
        throw new NotFoundException();
      }

      return ApiResponse.success(role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal memperbarui data role.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('utility.roles.delete')
  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus data role',
    description: 'Menghapus data role berdasarkan id role.',
  })
  @ApiOkResponse({
    type: RoleSuccessDeleteResponse,
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.rolesService.remove(+id);
      if (!result) {
        throw new NotFoundException();
      }

      return ApiResponse.success('Berhasil menghapus data role');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal menghapus data role.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }
}
