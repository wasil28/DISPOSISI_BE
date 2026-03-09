import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import * as multer from 'multer';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { AuthService } from 'src/application/v1/auth/auth.service';
import { UserService } from 'src/application/v1/user/user.service';
import { internalServerError, unauthorizedException } from '../utils/exception';

@Injectable()
export class RestAPIGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  private redisClient = this.redisService.getClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const { headers } = req;
      const authorization: string = headers.authorization;
      if (!authorization) unauthorizedException('anda tidak memiliki akses');

      const [type, token] = authorization.split(' ');

      if (type !== 'Bearer' || !token)
        unauthorizedException('anda tidak memiliki akses');

      const verified: any = verify(token, process.env.JWT_SECRET);
      if (!verified) unauthorizedException('Token anda tidak valid');

      // check if token iat is expired in 30 minutes
      if (!verified.exp) {
        if (new Date().getTime() > verified.iat * 1000 + 1800000)
          throw new UnauthorizedException(
            'Token tidak valid karena telah kadaluarsa.',
          );
      }
      // check if token is expired in 30 minutes
      if (new Date().getTime() > verified.exp * 1000)
        throw new UnauthorizedException(
          'Token tidak valid karena telah kadaluarsa.',
        );

      const userInfo: any = await this.authService.getUserInfoJwt(token);
      
      // Check if session is valid in Redis
      const sessionRedisKey = `session|${verified.data.id}`;
      console.log(`[RestAPIGuard] Checking Redis key: ${sessionRedisKey}`);
      console.log(`[RestAPIGuard] JWT payload:`, { sessionId: verified.data.id, userId: verified.data.userId });
      
      const sessionTtl = await this.redisClient.ttl(sessionRedisKey);
      console.log(`[RestAPIGuard] Session TTL: ${sessionTtl}`);
      
      if (sessionTtl < 0) {
         console.error(`[RestAPIGuard] Session expired or not found. TTL: ${sessionTtl}`);
         unauthorizedException('Sesi telah habis, silahkan melakukan login kembali.');
      }

      const sessionData = await this.redisClient.get(sessionRedisKey);
      if (sessionData) {
          console.log(`[RestAPIGuard] Session found in Redis`);
          req['session'] = JSON.parse(sessionData);
          req['user'] = req['session'].userGeneral; // userGeneral based on AuthService.login logic
      } else {
         console.warn(`[RestAPIGuard] Session not found in Redis, using fallback`);
         // Fallback or error if session not found but token valid
         const user = await this.userService.findOne({ id: verified.data.userId } as any);
         req['user'] = user;
      }

      return true;
    } catch (error) {
      internalServerError(error);
    }
  }
}
