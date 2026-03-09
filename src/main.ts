import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './application/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { LoggerModule, MyLogger } from './config/logger.config';
import { LoggerExceptionFilter } from './infrastructure/utils/logger.exception';
import * as Sentry from '@sentry/node';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SystemLogsModule } from './application/v1/rest/system-logs/system-logs.module';
import { SystemLogsService } from './application/v1/rest/system-logs/system-logs.service';

const expressIp = require('express-ip');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 8080;

  if (process.env.APP_ENV !== 'prod') {
    const options = new DocumentBuilder()
      .setTitle('Dokumentasi API BSSN TTE')
      .setDescription('Dokumentasi API untuk BSSN TTE')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  app.use(express.json({ limit: '50mb' }));
  app.enableCors({
    origin:
      process.env.APP_ENV === 'prod'
        ? ['https://bssn-tte.ut.ac.id']
        : '*',
    credentials: true,
  });
  // app.enableCors({
  //   origin: '*',
  //   credentials: true,
  // });
  app.useGlobalFilters(
    new LoggerExceptionFilter(
      app.get(HttpAdapterHost),
      app.select(LoggerModule).get(MyLogger),
      app.get(SystemLogsService),
    ),
  );
  app.use(expressIp().getIpInfoMiddleware);
  app.useLogger(app.get(MyLogger));
  app.use(Sentry.Handlers.requestHandler());
  // app.use(Sentry.Handlers.tracingHandler());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints),
        );
        throw new BadRequestException(messages.join('|'));
      },
      transform: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
