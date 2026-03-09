import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthTtmModule } from '../auth-ttm/auth-ttm.module';
import { UserGeneralResolver } from './user-general.resolver';
import { UserGeneralService } from './user-general.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGeneralEntity,
      SessionEntity,
      OtorisasiMenuEntity,
      GroupEntity,
    ]),
    forwardRef(() => AuthModule),
    AuthTtmModule,
  ],
  providers: [UserGeneralService, UserGeneralResolver],
  exports: [UserGeneralService],
})
export class UserGeneralModule {}
