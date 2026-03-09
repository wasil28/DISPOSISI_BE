import { PageableDto } from '../base.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SitusFilterPageableDto extends PageableDto {
  orderBy: string = 'id';
  order: string = 'ASC';
  keyword: string = '';
}

export class UpdateSitusDto {
  @IsNotEmpty()
  @IsString()
  nilaiPengaturan: string;

  @IsOptional()
  @IsString()
  keterangan: string;
}
