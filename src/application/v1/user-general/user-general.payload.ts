import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  isString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isEmail,
  IsEmail,
  Length,
} from 'class-validator';
import { DefaultPassword } from 'src/infrastructure/utils/default-password.decorator';
import { ErrorMessage } from 'src/infrastructure/utils/error-message';
import { Match } from 'src/infrastructure/utils/match.decorator';

@InputType()
export class UpdatePasswordUser {
  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  currentPassword: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  @DefaultPassword()
  password: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @Match('password')
  passwordConfirmation: string;
}

@ArgsType()
export class UpdatePasswordUserEmail {
  constructor(password: string, passwordConfirmation: string, email: string) {
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
    this.token = email;
  }
  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  @DefaultPassword()
  password: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @Match('password')
  passwordConfirmation: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  token: string;
}

@InputType()
export class RegisterAkun {
  @Field((type) => Int, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Role') })
  // @Match('id_role')
  idGroup: number;

  @Field((type) => Int, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Identitas ID') })
  // @Match('identitas_id')
  identitasId: number;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('NIK') })
  // @Match('nik')
  nik: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('No Pasport') })
  // @Match('no_pasport')
  noPasport: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('No Pasport') })
  // @Match('no_pasport')
  kodeAktifasiAkun: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Email') })
  @Length(1, 100, { message: ErrorMessage.MAX_CHAR('Email', 100) })
  @IsEmail({}, { message: 'Mohon masukan alamat email yang valid' })
  email: string;

  @Field((type) => String, { nullable: true })
//   @IsString()
//   @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Username') })
//   @MinLength(5, { message: ErrorMessage.MIN_CHAR('username', 5) })
//   @MaxLength(20, { message: ErrorMessage.MAX_CHAR('username', 20) })
  userName: string;

  // @Field(type => String, { nullable: false })
  // @IsString()
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Nama User') })
  // @MinLength(5, { message: ErrorMessage.MIN_CHAR('Nama User', 5) })
  // @MaxLength(20, { message: ErrorMessage.MAX_CHAR('Nama User', 20) })
  // // @Match('nama_user')
  // namaUser: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Nama User') })
  @MinLength(5, { message: ErrorMessage.MIN_CHAR('Nama User', 5) })
  @MaxLength(20, { message: ErrorMessage.MAX_CHAR('Nama User', 20) })
  // @Match('nama_user')
  name: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  @DefaultPassword()
  password: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @Match('password')
  passwordConfirmation: string;

  @Field((type) => Boolean, { nullable: true })
  emailVerified?: boolean;

  @Field((type) => Int, { nullable: true })
  status?: number;

  @Field((type) => String, { nullable: true })
  ecampusAccount?: string;
}


@InputType()
export class VerifikasiUser {

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Kode Aktivasi') })
  // @Match('no_pasport')
  kodeAktifasiAkun: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Email') })
  @Length(1, 100, { message: ErrorMessage.MAX_CHAR('Email', 100) })
  @IsEmail({}, { message: 'Mohon masukan alamat email yang valid' })
  email: string;
}

@InputType()
export class compareDataUser {

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('email') })
  ecampusAccount: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('name') })
  name: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('kode group') })
  kode_group: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('nama group') })
  nama_group: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('kode unit') })
  kode_unit: string;

  @Field((type) => String, { nullable: true })
  // @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('nama unit') })
  nama_unit: string;

}

@InputType()
export class AktivasiAkun {
  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Kode Aktivasi') })
  kodeAktifasiAkun: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Email') })
  @Length(1, 100, { message: ErrorMessage.MAX_CHAR('Email', 100) })
  @IsEmail({}, { message: 'Alamat email tidak valid' })
  email: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  password: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @Match('password')
  passwordConfirmation: string;
}

@InputType()
export class ResetPassword {
  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Kode') })
  kodeLupaPassword: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Email') })
  @Length(1, 100, { message: ErrorMessage.MAX_CHAR('Email', 100) })
  @IsEmail({}, { message: 'Alamat email tidak valid' })
  email: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @MinLength(6, { message: ErrorMessage.MIN_CHAR('password', 6) })
  @MaxLength(24, { message: ErrorMessage.MAX_CHAR('password', 24) })
  password: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @Match('password')
  passwordConfirmation: string;
}
