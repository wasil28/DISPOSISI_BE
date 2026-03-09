import { Module } from '@nestjs/common';
import { AuthSsoModule } from './auth-sso/auth-sso.module';
import { UtilityModule } from './utility/utility.module';
import { UpbjjModule } from './upbjj/upbjj.module';
import { SystemLogsModule } from './system-logs/system-logs.module';
// import { LeaderboardModule } from './leaderboard/leaderboard.module';


@Module({
  imports: [
    AuthSsoModule,
    UtilityModule,
    UpbjjModule,
    SystemLogsModule,
  ],  
})
export class RestModule {}
