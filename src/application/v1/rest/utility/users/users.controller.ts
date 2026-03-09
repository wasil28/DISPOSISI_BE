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
  BadRequestException,
  Req,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  CreateUserDto,
  UserFilterPageableDto,
  UserResponseDto,
  UserViewDto,
  UserSuccessResponse,
  UserSuccessPageableResponse,
  UserSuccessDeleteResponse,
} from 'src/dto/utility/users.dto';
import { LoggerService } from 'src/config/logger-file.config';
import { ApiResponse } from 'src/commons/response/response.util';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';
import { PermissionGuard } from 'src/infrastructure/guards/permission.guard';
import { RequirePermission } from 'src/infrastructure/decorators/require-permission.decorator';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.create')
  @Post()
  @ApiOperation({
    summary: 'Menambah user baru',
    description: 'Menambahkan user baru.',
  })
  @ApiCreatedResponse({
    type: UserSuccessResponse,
  })
  async create(@Req() request: any, @Body() createUserDto: CreateUserDto) {
    try {
      const { password, confirmPassword } = createUserDto;
      if (password !== confirmPassword) {
        throw new BadRequestException('Password tidak sesuai');
      }

      const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUND),
      );

      // Access IP address from request object
      const ipAddress = request.ips.length ? request.ips[0] : request.ip;

      const user = await this.userService.create({
        ...createUserDto,
        password: passwordHash,
        ipAddress: ipAddress,
        username: createUserDto.username.trim(),
        name: createUserDto.name.trim(),
        idNegaraDikti: 103,
        idUpbjj: createUserDto.idUpbjj, // Add UPBJJ support
      });

      const data = new UserViewDto(user);
      return ApiResponse.success(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return ApiResponse.badRequest(error.message);
      }

      this.logger.error('Gagal membuat user baru.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.view')
  @Get()
  @ApiOperation({
    summary: 'Mengambil daftar / list dari user',
    description: 'Mengambil daftar / list dari user.',
  })
  @ApiOkResponse({
    type: UserSuccessPageableResponse,
  })
  async findAll(@Query() filter: UserFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.userService.findAll(filter);

      const users = UserResponseDto(data);
      return ApiResponse.success(users, totalItems, totalPages, page);
    } catch (error) {
      this.logger.error('Gagal mengambil data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.view')
  @Get(':id')
  @ApiOperation({
    summary: 'Mengambil data user',
    description: 'Mengambil data user berdasarkan id dari user.',
  })
  @ApiOkResponse({
    type: UserSuccessResponse,
  })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(+id);
      if (!user) {
        throw new NotFoundException();
      }

      // console.log(user)

      const data = new UserViewDto(user);
      return ApiResponse.success(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.view')
  @Get('byemail/:email')
  @ApiOperation({
    summary: 'Mengambil data user',
    description: 'Mengambil data user berdasarkan id dari user.',
  })
  @ApiOkResponse({
    type: UserSuccessResponse,
  })
  async findOneEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException();
      }

      const data = new UserViewDto(user);
      return ApiResponse.success(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard)
  @Get('mahasiswa/:email')
  @ApiOperation({
    summary: 'Mengambil data user',
    description: 'Mengambil data user mahasiswa berdasarkan email dari user.',
  })
  @ApiOkResponse({
    type: UserSuccessResponse,
  })
  async findOneNim(@Param('email') email: string) {
    // try {
      const user = await this.userService.findOneMhsByEmail(email);
      // if (!user) {
      //   throw new NotFoundException();
      // }

      const data = new UserViewDto(user);
      return ApiResponse.success(data);
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     return ApiResponse.notFound();
    //   }
      

    //   this.logger.error('Gagal mengambil data user.', error);
    //   return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    // }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.update')
  @Patch(':id')
  @ApiOperation({
    summary: 'Memperbarui data user',
    description: 'Memperbarui data user berdasarkan id user.',
  })
  @ApiOkResponse({
    type: UserSuccessResponse,
  })
  async update(
    @Req() request: any,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const isUserExist = await this.userService.findOne(+id);
      if (!isUserExist) {
        throw new NotFoundException();
      }

      let passwordHash: string = isUserExist.password;
      const { currentPassword, password, confirmPassword } = updateUserDto;

      // if (currentPassword || password || confirmPassword) {
      if (password || confirmPassword) {
        // if (!currentPassword) {
        //   throw new BadRequestException('Masukan Kata Sandi saat ini');
        // }

        if (!password) {
          throw new BadRequestException('Masukan Kata Sandi baru');
        }

        if (!confirmPassword) {
          throw new BadRequestException('Masukan Konfirmasi Kata Sandi');
        }
      }
      
      const currentUser = request.user;
      const restrictedFields = ['roleIds', 'idFakultas', 'idProdi', 'idUpbjj'];
      const hasRestrictedUpdate = restrictedFields.some(field => updateUserDto[field] !== undefined);

      if (hasRestrictedUpdate) {
          // Check if user is Super Admin
          // Adapt the role check based on your actual Role entity and structure in req.user
          // Assuming req.user has roles array
          const isSuperAdmin = currentUser?.roles?.some((r: any) => 
               (r.name && r.name.toUpperCase() === 'SUPER ADMIN') || 
               (r.kode && (r.kode === 'RL01' || r.kode === 'RL001')) // Adjust codes as necessary
          );

          if (!isSuperAdmin) {
             throw new BadRequestException('Anda tidak memiliki akses untuk mengubah role atau data sensitif lainnya');
          }
      }

      // if (currentPassword && password !== confirmPassword) {
      if (password !== confirmPassword) {
        throw new BadRequestException(
          'Kata Sandi baru dan Konfirmasi Kata Sandi tidak sama',
        );
      }

      // if (currentPassword && password && confirmPassword) {
      if (password && confirmPassword) {
        // const isValidPass = await bcrypt.compare(
        //   currentPassword,
        //   isUserExist.password,
        // );

        // if (!isValidPass) {
        //   throw new BadRequestException('Kata Sandi saat ini salah');
        // }

        passwordHash = await bcrypt.hash(
          password,
          Number(process.env.SALT_ROUND),
        );
      }

      // Access IP address from request object
      const ipAddress = request.ips.length ? request.ips[0] : request.ip;

      // const user = await this.userService.updateUser(+id, {
      //   ...updateUserDto,
      //   password: passwordHash,
      //   ipAddress: ipAddress,
      //   username: updateUserDto.username?.trim(),
      //   name: updateUserDto.name?.trim(),
      //   status : updateUserDto.status,
      // });
      updateUserDto.password = passwordHash
      updateUserDto.ipAddress = ipAddress
      const user = await this.userService.updateUser(id,updateUserDto);
      if (!user) {
        throw new NotFoundException();
      }

      const data = new UserViewDto(user);
      return ApiResponse.success(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      if (error instanceof BadRequestException) {
        return ApiResponse.badRequest(error.message);
      }

      this.logger.error('Gagal memperbarui data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.update')
  @Patch('/role/:id')
  @ApiOperation({
    summary: 'Memperbarui data user role',
    description: 'Memperbarui data user role berdasarkan id user.',
  })
  @ApiOkResponse({
    type: UserSuccessResponse,
  })
  async updateRole(
    @Req() request: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const isUserExist = await this.userService.findOne(+id);
      if (!isUserExist) {
        throw new NotFoundException();
      }

      // Access IP address from request object
      const ipAddress = request.ips.length ? request.ips[0] : request.ip;

      const user = await this.userService.update(+id, {
        ...updateUserDto
      });
      if (!user) {
        throw new NotFoundException();
      }
      // console.log(user)

      if(updateUserDto.idProdi){ 
        // const prodi = await this.userService.updateProgramStudi(user.id,updateUserDto.idProdi, updateUserDto.roleIds)
        const prodi = await this.userService.updateProgramStudi(updateUserDto.idProdi, user.id)
      }

      if(updateUserDto.idFakultas){ 
        // const fakultas = await this.userService.updateFakultas(user.id,updateUserDto.idFakultas, updateUserDto.roleIds)
        const fakultas = await this.userService.updateFakultas(updateUserDto.idFakultas, user.id)
      }

      const data = new UserViewDto(isUserExist);
      return ApiResponse.success(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      if (error instanceof BadRequestException) {
        return ApiResponse.badRequest(error.message);
      }

      this.logger.error('Gagal memperbarui data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.delete')
  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus data user',
    description: 'Menghapus data user berdasarkan id user.',
  })
  @ApiOkResponse({
    type: UserSuccessDeleteResponse,
  })
  async remove(@Param('id') id: string) {
    try {
      const result2 = await this.userService.removeUserRole(+id);
      if (!result2) {
        throw new NotFoundException();
      }

      const result1 = await this.userService.remove(+id);
      if (!result1) {
        throw new NotFoundException();
      }
      

      return ApiResponse.success('Berhasil menghapus data user');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal menghapus data user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard, PermissionGuard)
  @RequirePermission('user.update')
  @Delete('/role/:idUserRole')
  @ApiOperation({
    summary: 'Menghapus data role user',
    description: 'Menghapus data role user berdasarkan id user.',
  })
  @ApiOkResponse({
    type: UserSuccessDeleteResponse,
  })
  async removeRole(@Param('idUserRole') idUserRole: number) {
    try {
      const result2 = await this.userService.removeUserRoleById(idUserRole);
      if (!result2) {
        throw new NotFoundException();
      }

      return ApiResponse.success('Berhasil menghapus data role user');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal menghapus data role user.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }
}
