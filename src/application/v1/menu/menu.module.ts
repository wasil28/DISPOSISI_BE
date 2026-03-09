import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modul } from 'src/entities/utility/modul.entity';
import { RolePriv } from 'src/entities/utility/role-priv.entity';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Modul, RolePriv])],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
