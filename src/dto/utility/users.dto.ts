import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsIP,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Meta, PageableDto, ResponseDto } from '../../dto/base.dto';
import { UserGeneralEntity } from '../../entities/user-general.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';

export class UserFilterPageableDto extends PageableDto {
  keyword?: string;
  order?: string;
  orderBy?: string;
}

export function UserResponseDto(data: UserGeneralEntity[]): UserViewDto[] {
  return data.map((user) => new UserViewDto(user));
}

export class UserViewDto {
  constructor(data: UserGeneralEntity) {
    this.id = data.id;
    this.username = data.username;
    this.ecampusAccount = data.ecampusAccount;
    this.email = data.email;
    this.status = data.status;
    this.name = data.name;

    this.userRoles = data.userRoles;
  
  }

  id: number;
  username: string;
  ecampusAccount: string;
  email: string;
  lastLogin: number;
  status: number;
  firstName: string;
  lastName: string;
  name: string;
  idPengembang: number;
  prefix: string;
  company: string;
  phone: string;
  userRoles: UserRole[];
}

export class CreateUserDto {
  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @IsOptional()
  idNegaraDikti?: number;

  @IsOptional()
  ecampusAccount?: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*()\-+=<>,.?\/\\{}|:;'\"\`~]).+$/,
  )
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*()\-+=<>,.?\/\\{}|:;'\"\`~]).+$/,
  )
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string;

  @IsOptional()
  idPengembang: number;

  @IsOptional()
  idUpbjj?: number; // Add UPBJJ support
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*()\-+=<>,.?\/\\{}|:;'\"\`~]).+$/,
  )
  @IsOptional()
  @MinLength(8)
  currentPassword?: string;

  @IsOptional()
  status: number;

  @IsOptional()
  roleIds: number;

  @IsOptional()
  idFakultas: number;
  
  @IsOptional()
  idProdi: number;
}

export class UserSuccessResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: UserViewDto;
  meta: Meta;
}

export class UserSuccessPageableResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: UserViewDto[];
  meta: Meta = {
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
  };
}

export class UserSuccessDeleteResponse implements ResponseDto {
  status: number = 200;
  message: string = 'success';
  data: string = 'Berhasil menghapus data user';
  meta: Meta;
}
