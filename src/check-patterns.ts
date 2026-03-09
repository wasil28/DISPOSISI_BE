
import { Module, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentPattern } from './infrastructure/entities/payment-pattern.entity';

import { DatabaseModule } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule
  ],
})
class CheckModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CheckModule);
  const logger = new Logger('CheckPatterns');

  try {
    // const all = await patternService.findAll();
    // logger.log(`Total Patterns Found: ${all.length}`);
    // all.forEach(p => {
    //     logger.log(`ID: ${p.id} | Name: ${p.patternName} | Regex: ${p.regexPattern} | Active: ${p.isActive}`);
    // });
  } catch (error) {
    logger.error('Check failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
