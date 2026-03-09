import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthTtmResolver } from './auth-ttm.resolver';
import { AuthTtmService } from './auth-ttm.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtorisasiMenuEntity, UserEntity]),
    HttpModule,
  ],
  providers: [AuthTtmService, AuthTtmResolver],
  exports: [AuthTtmService],
})
export class AuthTtmModule {}
