import { PageableDto } from '../base.dto';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SecPrivFilterPageableDto extends PageableDto {
  orderBy: string = 'id';
  order: string = 'ASC';
  keyword: string = '';
}

export class CreateSecPrivDto {
  @IsOptional()
  @IsNumber()
  idotorisasirole: number;

  @IsNotEmpty()
  @IsNumber()
  roleid: number;

  @IsNotEmpty()
  @IsNumber()
  moduleid: number;

  @IsNotEmpty()
  @IsNumber()
  allowview: number;

  @IsNotEmpty()
  @IsNumber()
  allownew: number;

  @IsOptional()
  @IsNumber()
  allowedit: number;

  @IsOptional()
  @IsNumber()
  allowdelete: number;

  @IsOptional()
  @IsNumber()
  allowdownload: number;

  @IsOptional()
  @IsNumber()
  allowapprove: number;
}

export class UpdateSecPrivDto extends PartialType(CreateSecPrivDto) {
  @IsNumber()
  id: number;
}
