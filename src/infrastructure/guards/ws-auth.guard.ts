import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);
  private readonly JWT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const userId = (client as any).userId;

      
      if (!userId) {
        this.logger.warn(`Unauthorized WebSocket request from ${client.id}`);
        throw new WsException('Unauthorized: No valid session');
      }

      // Verify token is still valid
      const token = this.extractToken(client);
      if (!token) {
        throw new WsException('Unauthorized: Token not found');
      }

      const decoded = jwt.verify(token, this.JWT_SECRET) as any;

      // Check token expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new WsException('Unauthorized: Token expired');
      }

      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      this.logger.error(`WsAuthGuard error: ${error.message}`);
      throw new WsException('Unauthorized: Invalid token');
    }
  }

  private extractToken(client: Socket): string | null {
    return (
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '') ||
      (client.handshake.query?.token as string) ||
      null
    );
  }
}
