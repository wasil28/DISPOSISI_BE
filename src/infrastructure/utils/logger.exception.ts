import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpServer,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { MyLogger } from '../../config/logger.config';
import { Handlers } from '@sentry/node';
import { Scope } from '@sentry/hub';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SentryService } from '@ntegral/nestjs-sentry';
import { Response, Request } from 'express';
import { forwardRef } from '@nestjs/common';
import { SystemLogsService } from '../../application/v1/rest/system-logs/system-logs.service';

@Catch()
export class LoggerExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(HttpAdapterHost) applicationRef: HttpServer,
    private logger: MyLogger,
    @Inject(forwardRef(() => SystemLogsService))
    private systemLogsService: SystemLogsService,
    private client: SentryService = SentryService.SentryServiceInstance(),
  ) {
    super(applicationRef);
  }
  catch(exception: any, context: ExecutionContext) {
    const args = context.getArgs();
    const requestArguments = args[1];
    const fieldName = args[3] ? args[3].fieldName : null;
    const message =
      exception instanceof Error ? exception.message : exception.message.error;
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    
    // Default response body structure
    let responseBody: any = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: context.getType().includes('graphql')
        ? null
        : context.switchToHttp().getRequest<Request>().url,
      message,
    };

    // If exception response is an object (e.g. from ForbiddenException with custom object), 
    // merge it into responseBody to preserve fields like 'permission' and 'detail'
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      responseBody = {
        ...responseBody,
        ...exceptionResponse
      };
    }
    const response = context.switchToHttp().getResponse<Response>();
    if (context.getType().includes('graphql')) {
      const gqlContext = GqlExecutionContext.create(context);
      this.client.instance().withScope((scope) => {
        scope.setExtra('arguments', requestArguments);
        scope.setExtra('fieldName', fieldName);
        this.throwToSentry(scope, gqlContext, exception);
      });
      this.logger.error(`Http Status ${exception.status}: ${message}`);
      
      this.systemLogsService.createLog({
          level: 'ERROR',
          source: 'SystemException',
          message: `GraphQL Exception: ${message}`,
          trace: exception instanceof Error ? exception.stack : undefined
      }).catch((e) => console.error('Failed to log to DB', e));

    } else {
      this.client.instance().withScope((scope) => {
        scope.setExtra('arguments', requestArguments);
        scope.setExtra('fieldName', fieldName);
        this.client.instance().captureException(exception);
      });
      this.logger.error(`Http Status ${exception.status}: ${message}`);
      
      const contextReq = context.switchToHttp().getRequest<Request>();
      this.systemLogsService.createLog({
          level: 'ERROR',
          source: 'SystemException',
          message: `HTTP Exception ${httpStatus}: ${message} (${contextReq.method} ${contextReq.url})`,
          trace: exception instanceof Error ? exception.stack : undefined
      }).catch((e) => console.error('Failed to log to DB', e));

      response.status(httpStatus).json(responseBody);
    }
  }

  throwToSentry(scope: Scope, context: any, exception: any) {
    const ctx = context.getContext();
    const info = context.getInfo();
    const data = Handlers.parseRequest(<any>{}, ctx.req, {});

    scope.setExtra('type', info.parentType.name);
    scope.setExtra('req', data.request);

    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    this.client.instance().captureException(exception);
  }
}
