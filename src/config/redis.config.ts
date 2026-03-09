import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RedisModule as Redis,
  RedisModuleOptions,
  RedisService,
} from '@liaoliaots/nestjs-redis';
import { LoggerModule, MyLogger } from './logger.config';

const redisConfig = (config: ConfigService): RedisModuleOptions => {
  return {
    config: {
      host: config.get<string>('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
      password: config.get<string>('REDIS_PASSWORD'),
    }
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    Redis.forRootAsync({
      useFactory: (configService: ConfigService) => redisConfig(configService),
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  providers: [MyLogger],
})
export class RedisModule implements OnModuleInit {
  constructor(
    private readonly redisClient: RedisService,
    private readonly logger: MyLogger,
  ) { }
  onModuleInit() {
    const client = this.redisClient.getClient();

    client.on('error', (error) => {
      this.logger.error(`REDIS ERROR: ${error.message}`);
    });

    client.on('connect', () => {
      this.logger.log('REDIS: Connected successfully');
    });

    client.on('ready', () => {
      this.logger.log('REDIS: Ready to accept commands');
    });

    client.on('reconnecting', () => {
      this.logger.warn('REDIS: Reconnecting...');
    });

    client.on('end', () => {
      this.logger.warn('REDIS: Connection ended');
    });
  }
}
