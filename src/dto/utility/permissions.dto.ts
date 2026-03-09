import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Permission } from 'src/entities/utility/permission.entity';

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  code?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}

export class PermissionFilterPageableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  start?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}

export class PermissionSuccessResponse {
  @ApiProperty()
  data: Permission;
}

export class PermissionSuccessPageableResponse {
  @ApiProperty()
  data: Permission[];

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;
}

export class PermissionSuccessDeleteResponse {
  @ApiProperty()
  message: string;
}
