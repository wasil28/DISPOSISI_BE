import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';

@Resolver((of) => UserEntity)
export class AuthTtmResolver {
  @UseGuards(AuthGuard)
  @Query((returns) => UserEntity)
  async myTtmSession(@Context('user') userCtx: UserEntity) {
    return userCtx;
  }
}
