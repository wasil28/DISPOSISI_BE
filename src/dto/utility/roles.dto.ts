import { Meta, PageableDto, ResponseDto } from '../base.dto';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/entities/utility/role.entity';

export class RoleFilterPageableDto extends PageableDto {
  orderBy?: string = 'id';
  order?: string = 'ASC';
  keyword?: string = '';
}

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  active?: number = 1;

  @IsOptional()
  @IsString()
  kodeSrs?: string;

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  kode: string;
}

export class AssignPermissionsDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class RoleSuccessResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: Role;
  meta: Meta;
}

export class RoleSuccessPageableResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: Role[];
  meta: Meta = {
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
  };
}

export class RoleSuccessDeleteResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: string = 'Berhasil menghapus data role';
  meta: Meta;
}
