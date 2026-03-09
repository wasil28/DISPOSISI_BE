import { Module, Global, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SystemLogsController } from './system-logs.controller';
import { SystemLogsService } from './system-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogEntity } from '../../../../entities/system-log.entity';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';
import { Permission } from 'src/entities/utility/permission.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      SystemLogEntity,
      Permission,
      RolePermission,
      UserRole
    ])
  ],
  controllers: [SystemLogsController],
  providers: [SystemLogsService],
  exports: [SystemLogsService], // Export service so other modules can use it to log
})
export class SystemLogsModule {}
