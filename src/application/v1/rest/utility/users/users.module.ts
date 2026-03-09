import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerFileModule } from 'src/config/logger-file.config';
import { Role } from 'src/entities/utility/role.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';
import { UserService } from 'src/application/v1/user/user.service';
import { AuthService } from 'src/application/v1/auth/auth.service';
import { UserGeneralService } from 'src/application/v1/user-general/user-general.service';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';

import { Permission } from 'src/entities/utility/permission.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Role, UserRole,
    UserEntity, UserGeneralEntity, SessionEntity, GroupEntity, OtorisasiMenuEntity,
    Permission, RolePermission
  ]), LoggerFileModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, UserService, UserGeneralService],
})
export class UsersModule { }
