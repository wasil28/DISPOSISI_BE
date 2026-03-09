import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  isString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  Length,
} from 'class-validator';
import { DefaultPassword } from 'src/infrastructure/utils/default-password.decorator';
import { ErrorMessage } from 'src/infrastructure/utils/error-message';
import { Match } from 'src/infrastructure/utils/match.decorator';

@ArgsType()
export class UpdatePasswordUser {
  constructor(password: string, passwordConfirmation: string) {
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
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
