import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DatabaseModule } from '../config/database.config';
import { RedisModule } from '../config/redis.config';
import { V1Module } from './v1/v1.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HealthChecksModule } from './health-checks/health-checks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { sentryPlugin } from 'src/infrastructure/utils/logging.plugin';
import { RestModule } from './v1/rest/rest.module';
import * as Sentry from '@sentry/node';
import { AzureADStrategy } from 'src/authentication/strategies/azuread.strategy';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'src/config/logger.config';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
// import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    RedisModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/resources/schema.gql'),
      driver: ApolloDriver,
      playground: false,
      plugins: [
        sentryPlugin,
        process.env.APP_ENV !== 'prod' ? ApolloServerPluginLandingPageLocalDefault() : ApolloServerPluginLandingPageProductionDefault({
          footer: false
        })
      ],
      context: ({ req }) => ({
        headers: req.headers,
        connection: req.connection,
        ipInfo: req.ipInfo,
      }),
      introspection: process.env.APP_ENV !== 'prod' ? true : false
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    V1Module,
    HealthChecksModule,
    RestModule,
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
  providers: [AzureADStrategy],
})
export class AppModule {}
