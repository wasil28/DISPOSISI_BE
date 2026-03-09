// src/minio/minio.module.ts
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioClientModule } from "./minio.config";
import { MinioController } from "./minio.controller";
import { MinioService } from "./minio.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MinioClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        // Ambil string endpoint lengkap dari env
        const fullEndpointUrl = cfg.get<string>('MINIO_ENDPOINT', 'http://minio:9000');
        // Ekstrak hostname saja dari URL
        // Contoh: dari "http://minio:9000" menjadi "minio"
        const endPointHostname = fullEndpointUrl.replace(/^https?:\/\//, '').split(':')[0];

        const portString = cfg.get<string>('MINIO_PORT', '9000');
        const accessKey = cfg.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
        const secretKey = cfg.get<string>('MINIO_SECRET_KEY', 'minioadmin');
        const useSslString = cfg.get<string>('MINIO_USE_SSL', 'false');
        const bucketName = cfg.get<string>('MINIO_BUCKET_NAME', 'sibu-pg-backups');

        return {
          endPoint: endPointHostname, // <-- UBAH KE SINI: Hanya hostname tanpa skema/port
          port: parseInt(portString, 10),
          accessKey: accessKey,
          secretKey: secretKey,
          useSSL: useSslString === 'true',
          bucket: bucketName,
        }
      }
    }),
  ],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService]
})
export class MinioModule {}
