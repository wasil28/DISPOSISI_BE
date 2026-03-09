import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ModulesModule } from './modules/modules.module';
import { RolesModule } from './roles/roles.module';
import { SitusModule } from './situs/situs.module';
import { SecPrivModule } from './sec_priv/sec_priv.module';
import { Permission } from '../../../../entities/utility/permission.entity';
import { RolePermission } from '../../../../entities/utility/role-permission.entity';
import { UserRole } from '../../../../entities/utility/user-role.entity';
import { PermissionSeederService } from './permission-seeder.service';
import { PermissionGuard } from '../../../../infrastructure/guards/permission.guard';
import { Role } from '../../../../entities/utility/role.entity';

import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Permission,
        RolePermission,
        Role,
        UserRole
    ]),
    ModulesModule,
    RolesModule,
    PermissionsModule,
    UsersModule,
    SitusModule,
    SecPrivModule,
  ],
  providers: [
    PermissionSeederService,
    PermissionGuard
  ],
  exports: [
    PermissionGuard
  ]
})
export class UtilityModule {}
