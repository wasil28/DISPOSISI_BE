import { HttpException, HttpStatus, Inject, Param, Request, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { validate } from 'class-validator';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthWithoutDefaultPasswordChecker } from 'src/infrastructure/guards/auth-password-checker.guard';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';
import {
  isCanGetData,
  validatePayload,
  checkRedisKeys,
  isCanUpdateData,
} from 'src/infrastructure/utils/check-arg';
import {
  badRequestError,
  internalServerError,
} from 'src/infrastructure/utils/exception';
import { UpdatePasswordUserEmail } from '../user/user.payload';
import { UserService } from '../user/user.service';
import { LoginPayload } from './auth.payload';
import { AuthService } from './auth.service';
const DeviceDetector = require('device-detector-js');
import { sign } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordEntity } from 'src/entities/reset-password.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import { genSaltSync, hashSync } from 'bcrypt';
import { RegisterAkun, VerifikasiUser, compareDataUser, AktivasiAkun, ResetPassword, UpdatePasswordUser } from '../user-general/user-general.payload';
import { MailerService } from '../mailer/MailerService';
import { Role } from '../../../entities/utility/role.entity';
import { HttpHelperx } from 'src/infrastructure/utils/http-helperx';
import { request } from 'http';
@Resolver((returns) => UserEntity)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    @InjectRepository(ResetPasswordEntity)
    private readonly rpRepo: Repository<ResetPasswordEntity>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('TTM_NOTIFICATION')
    private readonly client: ClientProxy,
    private readonly redis: RedisService,
    private readonly httpHelper: HttpHelperx
  ) {}

  private redisClient = this.redis.getClient();

  @Mutation(returns => String)
  async loginUser(
    @Context() ctx: any,
    @Args('user') loginPayload: LoginPayload,
    @Args('isSso', { type: () => Boolean, nullable: true, defaultValue: true }) isSso?: boolean
  ) {
    // validate request payload
    const error = await validate(new LoginPayload(loginPayload.email, loginPayload.password));
    // return bad request error if error
    // console.log(error);
    if (error.length > 0) badRequestError('Periksa kembali email/kata sandi anda');
    const ipInfo = {
      ip: ctx.ipInfo.ip,
      city: ctx.ipInfo.city ? ctx.ipInfo.city : null,
      timezone: ctx.ipInfo.timezone ? ctx.ipInfo.timezone : null,
      country: ctx.ipInfo.country || null,
      latitude: ctx.ipInfo.ll ? ctx.ipInfo.ll[0] : null,
      longitude: ctx.ipInfo.ll ? ctx.ipInfo.ll[1] : null
    };
    const { client, device, os } = new DeviceDetector().parse(ctx.headers['user-agent']);

    const session: SessionEntity = {
      ...ipInfo,
      browser: client.name,
      browserVersion: client.version,
      device: device ? device.type : "Unrecognized",
      deviceBrand: device ? device.brand : "Unrecognized",
      deviceModel: device ? device.model : "Unrecognized",
      os: os ? os.name : "Unrecognized",
      osVersion: os ? os.version : "Unrecognized"
    };
    
    return this.authService.login(loginPayload, session, isSso);
  }

  @UseGuards(AuthWithoutDefaultPasswordChecker)
  @Mutation(returns => String)
  async loginAsUserMhs(
    @Context() ctx: any,
    @Context('session') session: SessionEntity,
    @Args('user') loginPayload: LoginPayload,
    @Args('isSso', { type: () => Boolean, nullable: true, defaultValue: true }) isSso?: boolean
  ) {
    // validate request payload
    const error = await validate(new LoginPayload(loginPayload.email, loginPayload.password));
    // return bad request error if error
    console.log(error);
    if (error.length > 0) badRequestError('Periksa kembali email/kata sandi anda');
    const ipInfo = {
      ip: ctx.ipInfo.ip,
      city: ctx.ipInfo.city ? ctx.ipInfo.city : null,
      timezone: ctx.ipInfo.timezone ? ctx.ipInfo.timezone : null,
      country: ctx.ipInfo.country || null,
      latitude: ctx.ipInfo.ll ? ctx.ipInfo.ll[0] : null,
      longitude: ctx.ipInfo.ll ? ctx.ipInfo.ll[1] : null
    };
    const { client, device, os } = new DeviceDetector().parse(ctx.headers['user-agent']);

    const sessions: SessionEntity = {
      ...ipInfo,
      browser: client.name,
      browserVersion: client.version,
      device: device ? device.type : "Unrecognized",
      deviceBrand: device ? device.brand : "Unrecognized",
      deviceModel: device ? device.model : "Unrecognized",
      os: os ? os.name : "Unrecognized",
      osVersion: os ? os.version : "Unrecognized"
    };
    
    return this.authService.loginAsMhs(session.userGeneral.id, loginPayload, sessions);
  }

  @Mutation((returns) => Boolean)
  @UseGuards(AuthWithoutDefaultPasswordChecker) // skip checking default password
  async logoutUser(@Context('session') session: SessionEntity) {
    return this.authService.logout(session);
  }

  @Query((returns) => SessionEntity)
  @UseGuards(AuthWithoutDefaultPasswordChecker)
  async mySession(
    @Context('session') { id, isFirstLogin, isDefaultPassword }: SessionEntity,
  ) {
    const sessionDB = await this.authService.findSession(id);
    return { 
      ...sessionDB, 
      isFirstLogin, 
      isDefaultPassword,
      createdAt: sessionDB.createdAt || new Date(),
      updatedAt: sessionDB.updatedAt || new Date()
    };
  }

  @Mutation((returns) => Boolean)
  async resetPassword(
    @Args('payload') payload: ResetPassword,
  ) {
    try {
      if (!payload.password) {
        throw badRequestError('Masukan Kata Sandi baru');
      }

      if (!payload.passwordConfirmation) {
        throw badRequestError('Masukan Konfirmasi Kata Sandi');
      }

      if (payload.password !== payload.passwordConfirmation) {
        throw badRequestError('Kata Sandi baru dan Konfirmasi Kata Sandi tidak sama');
      }

      const isValid = await this.authService.resetPassword(payload) 
      if (!isValid) {
        return false
      }

      return true 
    } catch (error) {
      internalServerError(error);
    }
  }

  @Mutation((returns) => Boolean)
  async requestResetPassword(
    @Args('email') email: string,
    @Args('locale') locale?: string,
  ) {
    try {
      const language = locale.split('-')[0]
      const user = await this.authService.forgotPassword(email)

      if (!user) {
        return false
      }

      await this.mailerService.sendLupaPasswordEmail(user.email, user.kodeLupaPassword, language);

      return true;
    } catch (error) {
      internalServerError(error);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthWithoutDefaultPasswordChecker)
  async gantiPassword(
    @Args('payload') payload: UpdatePasswordUser,
    @Context('session') session: SessionEntity,
  ) {
    try {
      if (!payload.currentPassword) {
        throw badRequestError('Masukan Kata Sandi saat ini');
      }

      if (!payload.password) {
        throw badRequestError('Masukan Kata Sandi baru');
      }

      if (!payload.passwordConfirmation) {
        throw badRequestError('Masukan Konfirmasi Kata Sandi');
      }

      if (payload.password !== payload.passwordConfirmation) {
        throw badRequestError('Kata Sandi baru dan Konfirmasi Kata Sandi tidak sama');
      }

      const isValid = await this.authService.gantiPassword(session.userId, payload) 
      if (!isValid) {
        return false
      }

      return true

    } catch (error) {
      internalServerError(error);
    }
  }

  @Mutation((returns) => String)
  @UseGuards(AuthWithoutDefaultPasswordChecker)
  async updateSession(@Context('session') session: SessionEntity) {
    return this.authService.updateSession(session.id);
  }

  // @Mutation((returns) => Boolean)
  // async resetPasswordEmail(
  //   @Args() { password, passwordConfirmation, token }: UpdatePasswordUserEmail,
  // ) {
  //   try {
  //     await validatePayload(
  //       new UpdatePasswordUserEmail(password, passwordConfirmation, token),
  //     );

  //     const keys = await this.redisClient.keys(`*${token}*`);
  //     const userEmail = await this.redisClient.get(keys[0]);
  //     if (!userEmail)
  //       badRequestError(
  //         'Tautan telah kadaluwarsa atau tautan telah digunakan.',
  //       );
  //     const user = await this.userService.findOne(
  //       { email: userEmail },
  //       {},
  //       false,
  //     );
  //     isCanGetData(user, userEmail, 'Email');

  //     const updateUser = await this.userService.update(user.id, {
  //       password: hashSync(password, genSaltSync(12)),
  //     });
  //     isCanUpdateData(updateUser, 'user');
  //     const user_keys = await this.redisClient.keys(
  //       `*${keys[0].split('|').slice(0, 1).join('|')}*`,
  //     );
  //     await this.redisClient.del(user_keys);

  //     return true;
  //   } catch (error) {
  //     internalServerError(error);
  //   }
  // }

  @Mutation((returns) => Boolean)
  async registerAkun(
    @Args('payload') payload: RegisterAkun,
    @Context('session') session: SessionEntity,
  ) {
    try {
      const isCreate =  await this.authService.create(payload);

      try {
        await this.mailerService.sendVerificationEmail(
            isCreate.email,
            isCreate.kodeAktifasiAkun
            );
        } catch (error) {
        console.error('Error saat mengirim email:', error);
        }

      return true
    } catch (error) {
      internalServerError(error);
    }
  }

  @Mutation((returns) => Boolean)
  async verifikasiAkun(
    @Args('payload') payload: VerifikasiUser,
    @Context('session') session: SessionEntity,
  ) {
    try {
        const isVerif = await this.authService.verifikasiAkun(payload) 
        if (isVerif) {
            return true
        }else{
            return false
        }
    } catch (error) {
      internalServerError(error);
    }
  }

  @Mutation((returns) => Boolean)
  async compareSrsxKurikulum(
    @Args('payload') payload: compareDataUser,
    @Context('session') session: SessionEntity,
  ) {
    try {
        const isVerif = await this.authService.compareDataUser(payload) 
        if (isVerif) {
            return true
        }else{
            return false
        }
    } catch (error) {
      internalServerError(error);
    }
  } 

  @Mutation(() => Boolean)
  async aktivasiAkun(
    @Args('payload') payload: AktivasiAkun,
  ) {
    try {
      if (!payload.password) {
        throw badRequestError('Masukan Kata Sandi baru');
      }

      if (!payload.passwordConfirmation) {
        throw badRequestError('Masukan Konfirmasi Kata Sandi');
      }

      if (payload.password !== payload.passwordConfirmation) {
        throw badRequestError('Kata Sandi baru dan Konfirmasi Kata Sandi tidak sama');
      }

      const isAktif = await this.authService.aktivasiAkun(payload) 
      if (!isAktif) {
        return false
      }

      return true      
    } catch (error) {
      internalServerError(error);
    }
  }

  @Query(() => String)
  async getAccessToken(): Promise<string> {
    try {
      // Check if the token is in Redis
      const tokenRedis = await this.redisClient.get('TOKEN_SRS');
      
      if (tokenRedis) {
        // Return the token directly as a string from Redis
        return JSON.parse(tokenRedis);  // Ensure the token is stored as a plain string in Redis
      } else {
        // Token not found in Redis, hit the external API
        const param = {
          email: process.env.SRS_TOKEN_USER,
          password: process.env.SRS_TOKEN_PASS
        };

        // Call the API to get the token
        const result = await this.httpHelper.post<{ token?: string }>(
          `${process.env.SRS_TOKEN_HOST}/v1/auth`, 
          param
        );

        // Extract the token from the response
        const accessToken = result.token ? result.token : '';

        // Store the token as a plain string in Redis (without extra wrappers)
        await this.redisClient.set('TOKEN_SRS', JSON.stringify(accessToken), 'EX', 60 * 60);

        // Return the token directly
        return accessToken;
      }
    } catch (error) {
      throw new Error('Failed to retrieve the access token.');
    }
  }




}
