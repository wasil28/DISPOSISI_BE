import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from 'src/entities/group.entity';
import { OtorisasiMenuEntity } from 'src/entities/otorisasi-menu.entity';
import { ResetPasswordEntity } from 'src/entities/reset-password.entity';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserGeneralModule } from '../user-general/user-general.module';
import { MailerService } from '../mailer/MailerService';
import { Role } from '../../../entities/utility/role.entity';
import { HttpHelperx } from 'src/infrastructure/utils/http-helperx';
import { HttpModule } from '@nestjs/axios';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { SystemLogsModule } from '../rest/system-logs/system-logs.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGeneralEntity,
      SessionEntity,
      ResetPasswordEntity,
      OtorisasiMenuEntity,
      GroupEntity,
      Role
    ]),
    ClientsModule.registerAsync([
      {
        name: 'TTM_NOTIFICATION',
        inject: [ConfigService],
        useFactory: (env: ConfigService) => {
          return {
            options: {
              urls: [env.get<string>('AMQP_URL')],
              queue: 'ttm_notification',
              queueOptions: {
                durable: true,
              },
              persistent: true,
            },
            transport: Transport.RMQ,
          };
        },
      },
    ]),
    HttpModule,
    SystemLogsModule,
    forwardRef(() => UserGeneralModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    MailerService,
    AuthResolver,
    HttpHelperx
  ],
  exports: [AuthService],
})
export class AuthModule {}
