import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MyLogger } from './config/logger.config';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  
  // Use Custom Logger
  app.useLogger(app.get(MyLogger));
  
  // Initialize Sentry
  // Note: RequestHandler/TracingHandler are express middleware, not needed for AppContext
  
  const logger = app.get(MyLogger);
  logger.log('🚀 Worker Application Started');
  logger.log('PRESS CTRL-C TO STOP');

  // Keep the process alive
  // Nest ApplicationContext automatically stays alive if there are active listeners (like RabbitMQ)
}

bootstrap().catch(err => {
  console.error("Worker Failed to Start", err);
  process.exit(1);
});
