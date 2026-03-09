import * as winston from 'winston';
import { Injectable, Module, Inject, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SystemLogsService } from '../application/v1/rest/system-logs/system-logs.service';
import { SystemLogsModule } from '../application/v1/rest/system-logs/system-logs.module';

@Injectable()
export class LoggerService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => SystemLogsService))
    private readonly systemLogsService: SystemLogsService
  ) {}

  private date = new Date();
  private fileName =
    this.configService.get<string>('LOG_PATH') +
    'log_' +
    this.date.getFullYear() +
    '-' +
    String(this.date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(this.date.getDate()).padStart(2, '0') +
    '.log';

  private readonly logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
      ),
    ),
    exitOnError: false,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: this.fileName, level: 'error' }),
    ],
  });

  log(message: string) {
    this.logger.log('info', message);
    this.saveToDb('INFO', message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
    this.saveToDb('ERROR', message, trace);
  }

  warn(message: string, context?: any) {
    if (context) {
        this.logger.warn(message, context);
    } else {
        this.logger.warn(message);
    }
    this.saveToDb('WARN', message, context ? JSON.stringify(context) : undefined);
  }

  debug(message: string) {
    this.logger.debug(message);
    // Usually we don't save debug to DB unless needed.
  }

  private saveToDb(level: string, message: string, trace?: string) {
      try {
          // Asynchronous fire-and-forget
          this.systemLogsService.createLog({
              level,
              message,
              trace,
              source: 'System' // Default source, ideally passed in context
          }).catch(err => {
              // Fail silently to avoid infinite loops if DB is down
              console.error('Failed to write log to DB', err);
          });
      } catch (e) {
          console.error('Failed to initiate DB log save', e);
      }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    forwardRef(() => SystemLogsModule),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerFileModule {}
