import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpbjjController } from './upbjj.controller';
import { UpbjjService } from './upbjj.service';
import { MUpbjj } from '../../../../entities/m-upbjj.entity';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';
import { Permission } from 'src/entities/utility/permission.entity';
import { RolePermission } from 'src/entities/utility/role-permission.entity';
import { UserRole } from 'src/entities/utility/user-role.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MUpbjj,
            UserEntity,
            UserGeneralEntity,
            SessionEntity,
            GroupEntity,
            OtorisasiMenuEntity,
            Permission,
            RolePermission,
            UserRole,
        ]),
        AuthModule,
        UserModule
    ],
    controllers: [UpbjjController],
    providers: [UpbjjService],
    exports: [UpbjjService],
})
export class UpbjjModule { }
