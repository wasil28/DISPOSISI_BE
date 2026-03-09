import { Module } from '@nestjs/common';
import { SecPrivService } from './sec_priv.service';
import { SecPrivController } from './sec_priv.controller';
import { RolePriv } from 'src/entities/utility/role-priv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerFileModule } from 'src/config/logger-file.config';
import { Modul } from 'src/entities/utility/modul.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { GroupEntity } from 'src/entities/group.entity';
import { AuthService } from 'src/application/v1/auth/auth.service';
import { UserService } from 'src/application/v1/user/user.service';
import { UserGeneralService } from 'src/application/v1/user-general/user-general.service';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePriv, Modul, UserEntity, UserGeneralEntity, SessionEntity, GroupEntity, OtorisasiMenuEntity]),
    LoggerFileModule
  ],
  controllers: [SecPrivController],
  providers: [SecPrivService, AuthService, UserService, UserGeneralService],
})
export class SecPrivModule {}
