import { SetMetadata } from '@nestjs/common';

export const Menu = (kodeMenu: string) => SetMetadata('menu', kodeMenu);
