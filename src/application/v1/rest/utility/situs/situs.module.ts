import { Module } from '@nestjs/common';
import { SitusService } from './situs.service';
import { SitusController } from './situs.controller';
import { SettingSitus } from 'src/entities/utility/setting-situs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerFileModule } from 'src/config/logger-file.config';
import { AuthModule } from '../../../auth/auth.module';
import { UserModule } from '../../../user/user.module';
import { Permission } from 'src/entities/utility/permission.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingSitus, Permission, RolePermission, UserRole]),
    LoggerFileModule,
    AuthModule,
    UserModule
  ],
  controllers: [SitusController],
  providers: [SitusService],
})
export class SitusModule {}
