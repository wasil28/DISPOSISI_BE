import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { Meta, PageableDto, ResponseDto } from '../base.dto';
import { Modul } from 'src/entities/utility/modul.entity';

export class ModuleFilterPageableDto extends PageableDto {
  orderBy?: string = 'id';
  order?: string = 'ASC';
  keyword?: string = '';
}

export class CreateModuleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  alias: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  iconCls?: string;

  @IsNotEmpty()
  @IsNumber()
  seq: number;

  @IsNotEmpty()
  @IsNumber()
  pid: number;

  @IsNotEmpty()
  @IsNumber()
  publish: number;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  isSapage?: number;

  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @IsOptional()
  createdBy: string;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}

export class ModulSuccessResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: Modul;
  meta: Meta;
}

export class ModulSuccessPageableResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: Modul[];
  meta: Meta = {
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
  };
}

export class ModulSuccessDeleteResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: string = 'Berhasil menghapus data modul';
  meta: Meta;
}
