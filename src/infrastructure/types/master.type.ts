import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ErrorMessage } from '../utils/error-message';
import { IsSpaceOnly } from '../utils/is-space-only.decorator';
import { OneSpaceOnly } from '../utils/one-space-only.decorator';
import { PaginationResponse } from './pagination.response';

@InputType()
export class MasterPayload {
  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Keterangan') })
  @IsSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @OneSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @MaxLength(100, { message: ErrorMessage.MAX_CHAR('Keterangan', 100) })
  keterangan: string;

  createdBy?: string;
}

@InputType()
export class MasterUpdatePayload {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Keterangan') })
  @IsSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @OneSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @MaxLength(100, { message: ErrorMessage.MAX_CHAR('Keterangan', 100) })
  keterangan: string;
}

@InputType()
export class StatusAktifMasterCreatePayload {
  @IsNotEmpty({ message: 'Status aktif wajib diisi' })
  @Min(0, { message: ErrorMessage.INVALID_FIELD('Status Aktif') })
  @Field((type) => Int, { nullable: false, defaultValue: 0 })
  statusAktif: number;
}

@InputType()
export class StatusAktifMasterUpdatePayload {
  @IsOptional()
  @IsNotEmpty({ message: 'Status aktif wajib diisi' })
  @Min(0, { message: ErrorMessage.INVALID_FIELD('Status Aktif') })
  @Field((type) => Int, { nullable: true })
  statusAktif: number;
}

@InputType()
export class StatusAktifMasterArgs {
  @Field((type) => Int, { nullable: true })
  statusAktif: number;
}

@InputType()
export class MasterArgs {
  @Field((type) => String, { nullable: true })
  keterangan?: string;
  @Field((type) => String, { nullable: true })
  createdBy?: string;
  @Field((type) => String, { nullable: true })
  updatedBy?: string;
  @Field((type) => Date, { nullable: true })
  createdAt?: Date;
  @Field((type) => Date, { nullable: true })
  updatedAt?: Date;
}

export enum MasterFields {
  keterangan,
  createdAt,
  updatedAt,
}

registerEnumType(MasterFields, {
  name: 'MasterFields',
});

@InputType()
export class MasterWithStatusAktifCreatePayload extends StatusAktifMasterCreatePayload {
  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Keterangan') })
  @IsSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @OneSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @MaxLength(100, { message: ErrorMessage.MAX_CHAR('Keterangan', 100) })
  keterangan: string;

  createdBy?: string;
}

@InputType()
export class MasterWithStatusAktifUpdatePayload extends StatusAktifMasterUpdatePayload {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Keterangan') })
  @IsSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @OneSpaceOnly({ message: ErrorMessage.INVALID_FIELD('Keterangan') })
  @MaxLength(100, { message: ErrorMessage.MAX_CHAR('Keterangan', 100) })
  keterangan: string;
}
