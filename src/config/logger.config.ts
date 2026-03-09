import { Injectable, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { checkFiles } from 'src/infrastructure/utils/check-arg';

@Injectable()
export class MyLogger extends ConsoleLogger {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  error(message: string) {
    const date = new Date();
    const filePath = `${
      this.configService.get<string>('ERROR_LOG_PATH') + date.toDateString()
    }.log`;
    const data = `Error: ${message
      .split(' ')
      .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
      .join(' ')} [${new Date().toISOString()}]`;
    console.log('New Error Added ' + new Date().toLocaleString());
    console.log(data);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [MyLogger, ConfigService],
  exports: [MyLogger],
})
export class LoggerModule {}
