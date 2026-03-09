import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';

import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthWithoutDefaultPasswordChecker } from 'src/infrastructure/guards/auth-password-checker.guard';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';
import { internalServerError } from 'src/infrastructure/utils/exception';

import { UserService } from './user.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

}
