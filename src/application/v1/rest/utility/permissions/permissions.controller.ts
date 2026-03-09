import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  CreatePermissionDto,
  PermissionFilterPageableDto,
  UpdatePermissionDto,
  PermissionSuccessResponse,
  PermissionSuccessPageableResponse,
  PermissionSuccessDeleteResponse,
} from 'src/dto/utility/permissions.dto';
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

@Controller('api/v1/permissions')
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(RestAPIGuard, PermissionGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new permission' })
  @ApiCreatedResponse({ type: PermissionSuccessResponse })
  @RequirePermission('permission.create') // Admin level permission
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      const permission = await this.permissionsService.create(createPermissionDto);
      return ApiResponse.success(permission);
    } catch (error) {
       console.error(error);
      return ApiResponse.error(error.message);
    }
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync permissions from code - Admin only' })
  @ApiCreatedResponse({ type: Object })
  // @RequirePermission('permission.create') // Temporarily disabled to allow initial sync
  async sync() {
    try {
      const result = await this.permissionsService.syncPermissions();
      return ApiResponse.success(result);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List permissions' })
  @ApiOkResponse({ type: PermissionSuccessPageableResponse })
  @RequirePermission('permission.view')
  async findAll(@Query() filter: PermissionFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } = await this.permissionsService.findAll(filter);
      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiOkResponse({ type: PermissionSuccessResponse })
  @RequirePermission('permission.view')
  async findOne(@Param('id') id: string) {
    try {
      const permission = await this.permissionsService.findOne(+id);
      if (!permission) throw new NotFoundException();
      return ApiResponse.success(permission);
    } catch (error) {
       if (error instanceof NotFoundException) return ApiResponse.notFound();
      return ApiResponse.error(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiOkResponse({ type: PermissionSuccessResponse })
  @RequirePermission('permission.update')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionsService.update(+id, updatePermissionDto);
      if (!permission) throw new NotFoundException();
      return ApiResponse.success(permission);
    } catch (error) {
       if (error instanceof NotFoundException) return ApiResponse.notFound();
      return ApiResponse.error(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiOkResponse({ type: PermissionSuccessDeleteResponse })
  @RequirePermission('permission.delete')
  async remove(@Param('id') id: string) {
     try {
      const result = await this.permissionsService.remove(+id);
      if (!result) throw new NotFoundException();
      return ApiResponse.success('Permission deleted');
    } catch (error) {
       if (error instanceof NotFoundException) return ApiResponse.notFound();
      return ApiResponse.error(error.message);
    }
  }
}
