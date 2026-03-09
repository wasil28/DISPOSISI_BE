import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { ReadStream } from 'fs';
import { Client } from 'minio';
import { streamBuffer } from 'src/infrastructure/utils/stream-buffer';
import { MINIO_CLIENT } from './minio.config';
import * as stream from 'stream';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {}

  private fileName(file: Express.Multer.File): string {
    const temp_filename = Date.now().toString();
    const hashedFileName = createHash('md5')
      .update(temp_filename)
      .digest('hex');
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    return hashedFileName + ext;
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string = this.configService.get<string>('MINIO_BUCKET'),
    group = '',
  ) {
    try {
      const filename = group
        ? group + this.fileName(file)
        : this.fileName(file);
      const metaData = {
        'Content-Type': file.mimetype,
        Source: 'BE BIMON',
      };

      await this.minioClient.putObject(
        bucketName,
        filename,
        file.buffer,
        null,
        metaData,
      );
      return filename;
    } catch (error) {
      throw error;
    }
  }

  async uploadFileWithPrefix(
    file: Express.Multer.File,
    prefix: string,
    bucketName: string = this.configService.get<string>('MINIO_BUCKET'),
  ): Promise<{
    filename: string;
    prefix: string;
    url: string;
    mime: string;
  }> {
    try {
      const filename = this.fileName(file);
      const metaData = {
        'Content-Type': file.mimetype,
        Source: 'BE BIMON',
      };

      await this.minioClient.putObject(
        bucketName,
        `${prefix}/${filename}`,
        file.buffer,
        null,
        metaData,
      );

      return {
        filename,
        prefix,
        url: `${prefix}/${filename}`,
        mime: file.mimetype,
      };
    } catch (error) {
      throw error;
    }
  }

  async getObject(
    objectName: string,
    bucketName: string = this.configService.get<string>('MINIO_BUCKET'),
  ): Promise<Buffer> {
    try {
      // console.log(objectName);
      const objectStream = await this.minioClient.getObject(
        bucketName,
        objectName,
      );
      return streamBuffer(objectStream as ReadStream);
    } catch (error) {
      throw new NotFoundException('Object not found in MinIO');
    }
  }

  async getFileStream(
    objectName: string,
    bucketName: string = this.configService.get<string>('MINIO_BUCKET'),
  ): Promise<stream.Readable> {
    try {
      const objectStream = await this.minioClient.getObject(
        bucketName,
        objectName,
      );
      return objectStream;
    } catch (error) {
      throw new NotFoundException('Object not found in MinIO');
    }
  }

  // async getFileUrl(bucketName: string, fileName: string) {
  //   const url = await this.minioClient.presignedUrl(
  //     'GET',
  //     bucketName,
  //     fileName
  //   );

  //   return url.split('?')[0];
  // }

  async deleteFile(bucketName: string, objectName: string) {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
    } catch (error) {
      throw new HttpException(
        'An error occured when deleting!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.configService.get<string>('MINIO_BUCKET'),
      fileName,
      60 * 60,
    );
  }
  // async getFileUrl2(fileName: string): Promise<string> {
  //   // 1. Dapatkan presigned URL dari MinIO client.
  //   // URL ini akan mengandung hostname INTERNAL, contoh: 'http://minio-service:9000/...'
  //   const internalPresignedUrl = await this.minioClient.presignedUrl(
  //     'GET',
  //     this.configService.get<string>('MINIO_BUCKET'),
  //     fileName,
  //     60 * 60, // Expire dalam 1 jam
  //   );

  //   // 2. Dapatkan alamat internal dan eksternal dari environment variable.
  //   const internalEndpoint = this.configService.get<string>('MINIO_ENDPOINT'); // http://minio-service:9000
  //   const externalUrl = this.configService.get<string>('MINIO_EXTERNAL_URL');   // http://localhost:9001

  //   // 3. Lakukan penggantian (replace) string sederhana.
  //   // Ganti bagian dasar URL internal dengan URL eksternal.
  //   const publicUrl = internalPresignedUrl.replace(internalEndpoint, externalUrl);

  //   // 4. Kembalikan URL final yang sudah benar.
  //   return publicUrl;
  // }
  
  async updateFileWithPrefix(
    file: Express.Multer.File,
    prefixAll: string,
    bucketName: string = this.configService.get<string>('MINIO_BUCKET'),
  ): Promise<{
    prefixAll: string;
    url: string;
    mime: string;
  }> {
    try {
      const metaData = {
        'Content-Type': file.mimetype,
        Source: 'BE BIMON',
      };

      await this.minioClient.putObject(
        bucketName,
        prefixAll,
        file.buffer,
        null,
        metaData,
      );
      console.log(bucketName, prefixAll, file.buffer, null, metaData);

      return {
        prefixAll,
        url: prefixAll,
        mime: file.mimetype,
      };
    } catch (error) {
      throw error;
    }
  }


  async checkConnection(bucketName: string = this.configService.get<string>('MINIO_BUCKET')): Promise<any> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      return {
        status: 'up',
        bucket: bucketName,
        exists
      };
    } catch (error) {
      return {
        status: 'down',
        error: error.message
      };
    }
  }
}
