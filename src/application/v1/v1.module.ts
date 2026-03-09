import { Module } from '@nestjs/common';
import { AuthTtmModule } from './auth-ttm/auth-ttm.module';
import { AuthModule } from './auth/auth.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    AuthModule,
    AuthTtmModule,
    MasterModule,
  ],
})
export class V1Module {}
