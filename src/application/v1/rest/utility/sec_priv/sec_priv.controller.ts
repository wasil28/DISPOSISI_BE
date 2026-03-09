import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SecPrivService } from './sec_priv.service';
import { LoggerService } from 'src/config/logger-file.config';
import {
  CreateSecPrivDto,
  SecPrivFilterPageableDto,
  UpdateSecPrivDto,
} from 'src/dto/utility/sec_priv.dto';
import { ApiResponse } from 'src/commons/response/response.util';
import { ApiTags } from '@nestjs/swagger';
import { RestAPIGuard } from 'src/infrastructure/guards/rest-api.guard';

@Controller('/api/v1/secpriv')
@ApiTags('Role Privilege')
export class SecPrivController {
  constructor(
    private readonly secprivService: SecPrivService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(RestAPIGuard)
  @Get()
  async findAll(@Query() filter: SecPrivFilterPageableDto) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.secprivService.findAll(filter);

      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      this.logger.error('Gagal mengambil data role privilege.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard)
  @Post('')
  async create(@Body() createSecPrivDto: CreateSecPrivDto[]) {
    try {
      createSecPrivDto.forEach(async (element) => {
        await this.secprivService.create({
          ...element,
        });
      });

      return ApiResponse.success(
        createSecPrivDto,
        createSecPrivDto.length,
        1,
        1,
      );
    } catch (error) {
      this.logger.error('Gagal membuat role privilege.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  // @UseGuards(RestAPIGuard)
  @Get(':roleId')
  async findOne(
    @Param('roleId') roleId: string,
    @Query() filter: SecPrivFilterPageableDto,
  ) {
    try {
      const { data, totalItems, totalPages, page } =
        await this.secprivService.findOne(+roleId, filter);

      return ApiResponse.success(data, totalItems, totalPages, page);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal mengambil data role privilege.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }

  @UseGuards(RestAPIGuard)
  @Patch(':roleId')
  async update(
    @Param('roleId') roleId: number,
    @Body() updateSecPrivDto: UpdateSecPrivDto[],
  ) {
    try {
      updateSecPrivDto.forEach(async (element) => {
        
        if(
          (element.allowview != 0 ||
          element.allownew != 0 ||
          element.allowedit != 0 ||
          element.allowdelete != 0 ||
          element.allowdownload != 0 ||
          element.allowapprove != 0 )
          && element.idotorisasirole == null
        ){
            const payload = {
                roleid : roleId,
                moduleid : element.moduleid,
                allowview : element.allowview,
                allownew : element.allownew,
                allowedit : element.allowedit,
                allowdelete : element.allowdelete,
                allowdownload : element.allowdownload,
                allowapprove : element.allowapprove,
                idotorisasirole : 0
            }
            await this.secprivService.create({
                ...payload,
              }); 
        }else if(
          element.allowview == 0 &&
          element.allownew == 0 &&
          element.allowedit == 0 &&
          element.allowdelete == 0 &&
          element.allowdownload == 0 &&
          element.allowapprove == 0 && 
          element.idotorisasirole != null
        ){
          await this.secprivService.remove(element.idotorisasirole);
        
        }else if(element.idotorisasirole != null){
            const secpriv = await this.secprivService.update(+roleId, element);
            // if (!secpriv) {
            //   throw new NotFoundException();
            // }
        }
      });

      return ApiResponse.success(
        updateSecPrivDto,
        updateSecPrivDto.length,
        1,
        1,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.notFound();
      }

      this.logger.error('Gagal memperbarui data role privilege.', error);
      return ApiResponse.error('Terjadi kesalahan dari sisi server.');
    }
  }
}
