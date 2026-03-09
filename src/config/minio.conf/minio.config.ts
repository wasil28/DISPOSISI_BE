import { ConfigurableModuleBuilder, Global, Module } from '@nestjs/common';
import { Client } from 'minio';


interface MinioModuleOptions {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const {
  ConfigurableModuleClass: ConfigureMinioModule,
  MODULE_OPTIONS_TOKEN: MINIO_OPTIONS,
} = new ConfigurableModuleBuilder<MinioModuleOptions>().setClassMethodName('forRoot').build()

@Global()
  @Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [MINIO_OPTIONS],
      useFactory: async (minioOptions: MinioModuleOptions) => {
        return new Client({
          endPoint: minioOptions.endPoint,
          port: minioOptions.port,
          useSSL: minioOptions.useSSL,
          accessKey: minioOptions.accessKey,
          secretKey: minioOptions.secretKey,
          region: 'us-east-1', 
        })
      }
    },
  ], 
  exports: [MINIO_CLIENT]
})
export class MinioClientModule extends ConfigureMinioModule {}
