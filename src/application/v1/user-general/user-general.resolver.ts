import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { AplikasiEntity } from 'src/entities/aplikasi.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';
import { internalServerError } from 'src/infrastructure/utils/exception';
import { MenuType } from '../menu/menu.type';
import { UserGeneralService } from './user-general.service';

@Resolver(() => UserGeneralEntity)
export class UserGeneralResolver {
  constructor(private readonly userGeneralService: UserGeneralService) {}

  @Query(() => [AplikasiEntity])
  @UseGuards(AuthGuard)
  async getAplikasi(@Context('session') session: SessionEntity) {
    try {
      return await this.userGeneralService.getAplikasi(session.userGeneral);
    } catch (error) {
      internalServerError(error);
    }
  }

  @Query(() => [MenuType])
  @UseGuards(AuthGuard)
  async getMenuByAplikasi(
    @Context('user') user: UserGeneralEntity,
    @Args('idAplikasi', { type: () => Int, nullable: false })
    idAplikasi: number,
  ) {
    try {
      const parent = await this.userGeneralService.getParentMenu(
        user.id,
        idAplikasi,
      );
      return await Promise.all(
        parent.map(async ({ menu }) => ({
          ...menu,
          submenu: await this.userGeneralService.getSubMenu(
            user.id,
            idAplikasi,
            menu.kodeMenu,
          ),
        })),
      );
    } catch (error) {
      internalServerError(error);
    }
  }
}
