import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MenuService } from 'src/application/v1/menu/menu.service';
import { SessionEntity } from 'src/entities/session.entity';
import { unauthorizedError } from '../utils/exception';

@Injectable()
export class OtorisasiMenuGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly menuService: MenuService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const kodeMenu = this.reflector.get<string>('menu', context.getHandler());

    const {
      userGeneral: {
        idGroup,
      },
    }: SessionEntity = context.getArgs()[2].session;

    if (!kodeMenu) return true;
    const menu = await this.menuService.findMenu(idGroup, kodeMenu);
    if (menu.length < 1)
      unauthorizedError('Anda tidak memiliki akses ke fasilitas ini.');

    return true;
  }
}
