import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modul } from 'src/entities/utility/modul.entity';
import { LoggerFileModule } from 'src/config/logger-file.config';
import { AuthService } from 'src/application/v1/auth/auth.service';
import { UserService } from 'src/application/v1/user/user.service';
import { UserGeneralService } from 'src/application/v1/user-general/user-general.service';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { AuthModule } from '../../../auth/auth.module';
import { UserModule } from '../../../user/user.module';
import { Permission } from 'src/entities/utility/permission.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Modul, UserEntity, UserGeneralEntity, SessionEntity, GroupEntity, OtorisasiMenuEntity, Permission, RolePermission, UserRole]),
    LoggerFileModule,
    AuthModule,
    UserModule
  ],
  controllers: [ModulesController],
  providers: [ModulesService, UserGeneralService],
})
export class ModulesModule {}
