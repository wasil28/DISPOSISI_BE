import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthSsoController } from './auth-sso.controller';
import { AuthSsoService } from './auth-sso.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([

    ]),
    PassportModule.register({
      defaultStrategy: 'AzureAD',
    }),
    
  ],
  controllers: [AuthSsoController],
  providers: [AuthSsoService],
})
export class AuthSsoModule {}
