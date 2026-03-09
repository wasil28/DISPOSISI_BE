import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { SessionEntity } from 'src/entities/session.entity';

export function internalServerError(error: Error | string): HttpException {
  if (error instanceof HttpException)
    throw new HttpException(error.getResponse(), error.getStatus());
  throw new HttpException(error as string, HttpStatus.INTERNAL_SERVER_ERROR);
}

export function notFoundError(message: string): HttpException {
  throw new NotFoundException(message);
}

export function unauthorizedError(message: string): HttpException {
  throw new UnauthorizedException(message);
}

export function badRequestError(message: string): HttpException {
  throw new BadRequestException(message);
}

export class IsDefaultPasswordExceptionError extends GraphQLError {
  constructor(session: SessionEntity) {
    super('Silahkan ganti kata sandi Anda terlebih dahulu.');
    this.session = session;
  }

  session: SessionEntity;
}

export class FirstLoginException extends GraphQLError {
  constructor(session: SessionEntity) {
    super('Silahkan ganti kata sandi Anda terlebih dahulu.');
    this.session = session;
  }
  session: SessionEntity;
}

export const unauthorizedException = (
  message = 'Anda Tidak Memiliki Akses',
): UnauthorizedException => {
  throw new UnauthorizedException(message);
};
