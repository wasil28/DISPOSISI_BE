import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/utility/permission.entity';
import { AuthModule } from 'src/application/v1/auth/auth.module';
import { UserModule } from 'src/application/v1/user/user.module';
import { LoggerFileModule } from 'src/config/logger-file.config';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Permission, 
        RolePermission,
        UserEntity, 
        UserGeneralEntity, 
        SessionEntity, 
        GroupEntity, 
        OtorisasiMenuEntity,
        UserRole
    ]),
    LoggerFileModule,
    AuthModule,
    UserModule,
    DiscoveryModule
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
