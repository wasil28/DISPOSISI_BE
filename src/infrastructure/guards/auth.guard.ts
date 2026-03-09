import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { AuthTtmService } from 'src/application/v1/auth-ttm/auth-ttm.service';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  // inject service to check user data or session
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authTtmService: AuthTtmService,
  ) {}

  private redisClient = this.redisService.getClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //return true; //sementara
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.headers.authorization) {
      throw new BadRequestException('Silahkan login terlebih dahulu.');
    }

    const [type, token] = ctx.headers.authorization.split(' ');

    if (type !== 'Bearer' || !token)
      throw new BadRequestException('Token tidak valid');

    const validateToken: any = this.validateToken(token);
    // check if token iat is expired in 30 minutes
    if (!validateToken.exp) {
      if (new Date().getTime() > validateToken.iat * 1000 + 1800000)
        throw new UnauthorizedException(
          'Token tidak valid karena telah kadaluarsa.',
        );
    }
    // check if token is expired in 30 minutes
    if (new Date().getTime() > validateToken.exp * 1000)
      throw new UnauthorizedException(
        'Token tidak valid karena telah kadaluarsa.',
      );

    if ((await this.redisClient.ttl(`session|${validateToken.data.id}`)) < 0) {
      throw new BadRequestException(
        'Sesi telah habis, silahkan melakukan login kembali.',
      );
    }

    // Update Session (5 minutes before expired)
    //if (new Date().getTime() > validateToken.iat * 1000 + 1500000 && new Date().getTime() < validateToken.exp * 1000){
    //console.log('update session')
    //await this.authTtmService.updateSession(ctx.headers.authorization)
    //}

    //console.log(new Date() + ' ~~~ ' + new Date(validateToken.iat * 1000 + 1800000))
    //console.log(new Date() + ' ~~~ ' + new Date(validateToken.exp * 1000))

    ctx['session'] = JSON.parse(
      await this.redisClient.get(`session|${validateToken.data.id}`),
    );
    //ctx['user'] = await this.userRepo.findOne({where:{id:ctx['session'].userId}});
    //ctx['session'].user = ctx['user'];
    ctx['user'] = ctx['session'].user;

    return true;
  }

  validateToken(token: string) {
    const verified = verify(token, process.env.JWT_SECRET);
    if (!verified) throw new BadRequestException('Sesi anda tidak valid');

    return verified;
  }
}
