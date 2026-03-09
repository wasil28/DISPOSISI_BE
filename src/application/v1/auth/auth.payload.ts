import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ErrorMessage } from 'src/infrastructure/utils/error-message';

@InputType()
export class LoginPayload {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Alamat Email') })
  @IsEmail({}, { message: ErrorMessage.INVALID_FIELD('email') })
  email: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty({ message: ErrorMessage.EMPTY_FIELD('Password') })
  @IsString()
  password: string;
}
