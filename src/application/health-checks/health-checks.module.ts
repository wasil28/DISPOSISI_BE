import { Module } from '@nestjs/common';
import { HealthChecksController } from './health-checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'src/config/minio.conf/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    MinioModule,
    ConfigModule,
  ],
  controllers: [HealthChecksController],
})
export class HealthChecksModule {}
