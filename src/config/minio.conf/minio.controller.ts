import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Response } from 'express';
import { join } from 'path';
import { internalServerError } from 'src/infrastructure/utils/exception';
import { MinioService } from './minio.service';

class BodyDownload {
  @IsOptional()
  prefix?: string;

  @IsNotEmpty()
  mime: string;

  @IsNotEmpty()
  file_name: string;

  @IsOptional()
  bucket?: string;
}

@Controller('api')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('v1/minio/upload')
  async insert(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket?: string,
  ) {
    try {
      const fileUpload = await this.minioService.uploadFile(file, bucket);
      return {
        mime: file.mimetype,
        url: fileUpload,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('v1/minio/upload-with-prefix')
  async insertWithPrefix(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket?: string,
    @Body('prefix') prefix?: string,
  ) {
    try {
      return await this.minioService.uploadFileWithPrefix(file, prefix, bucket);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('v1/minio/get-berkas')
  async getBerkas(@Body() dto: BodyDownload, @Res() res: Response) {
    try {
      const berkasName = !dto.prefix
        ? dto.file_name
        : join(dto.prefix, dto.file_name).replace(/\\/g, '/');

      const dataBuffer = await this.minioService.getObject(
        berkasName,
        dto.bucket,
      );

      res.setHeader('Content-Type', dto.mime).status(200).send(dataBuffer);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('v1/minio/berkas/:fileName')
  async getBerkasUrl(@Param('fileName') fileName: string) {
    const fileUrl = await this.minioService.getFileUrl(fileName);
    return fileUrl;
  }

  @Post('v1/minio/berkas')
  async getBerkasUrlWithPrefix(
    @Body('file_name') fileName: string,
    @Body('prefix') prefix?: string,
  ) {
    try {
      const berkasName = !prefix
        ? fileName
        : join(prefix, fileName).replace(/\\/g, '/');
      return await this.minioService.getFileUrl(berkasName);
    } catch (error) {
      internalServerError(error);
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('v1/minio/update-with-prefix')
  async putFilePrefix(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket?: string,
    @Body('prefixAll') prefixAll?: string,
  ) {
    try {
      return await this.minioService.updateFileWithPrefix(
        file,
        prefixAll,
        bucket,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
