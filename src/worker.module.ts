import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.config';
import { RedisModule } from './config/redis.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './config/logger.config';
// import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    RedisModule,
    // Sentry is good to have for worker errors too
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (env: ConfigService) => ({
        dsn: env.get<string>('SENTRY_DSN'),
        tracesSampleRate: parseFloat(env.get<string>('SAMPLE_RATE')),
        integrations: [new Sentry.Integrations.Http({ tracing: true })],
      }),
      inject: [ConfigService],
    }),
    // RabbitMQModule,
  ],
})
export class WorkerModule {}
