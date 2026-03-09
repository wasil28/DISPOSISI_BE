import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'src/application/v1/auth/auth.service';
import { UserService } from 'src/application/v1/user/user.service';
import {
  IsDefaultPasswordExceptionError,
  unauthorizedError,
} from '../utils/exception';
import { UserGeneralService } from 'src/application/v1/user-general/user-general.service';

@Injectable()
export class AuthWithoutDefaultPasswordChecker implements CanActivate {
  // inject service to check user data or session
  constructor(
    private readonly authService: AuthService,
    private readonly userGeneralService: UserGeneralService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.headers.authorization) {
      unauthorizedError('Silahkan login terlebih dahulu');
    }

    const unprocessed = ctx.headers.authorization;
    if (unprocessed.split(' ')[0] !== 'Bearer')
      unauthorizedError('Token tidak valid.');

    const [_, token] = unprocessed.split(' ');
    if (
      token === undefined ||
      token === null ||
      token === '' ||
      token.length < 1
    )
      unauthorizedError('Token tidak valid.');

    this.authService.verifyToken(token);
    const { data } = await this.authService.decodeToken(token);
    // const expirationDate = new Date(data.expiredAt);
    // const fiveMinutesBeforeExpiration = new Date(expirationDate.getTime() - 5 * 60000); // Kurangi 5 menit dari waktu kedaluwarsa

    // // Dapatkan waktu sekarang
    // const now = new Date();

    // // Cek apakah sekarang kurang dari 5 menit sebelum waktu kedaluwarsa
    // if (now.getTime() >= fiveMinutesBeforeExpiration.getTime() && now.getTime() < expirationDate.getTime()) {
    //   // return true; // Masih dalam 5 menit sebelum kedaluwarsa
    //   console.log('Masih dalam 5 menit sebelum kedaluwarsa')
    // } else {
    //   console.log('Sudah melewati 5 menit sebelum kedaluwarsa atau setelah kedaluwarsa')
    //   // return false; // Sudah melewati 5 menit sebelum kedaluwarsa atau setelah kedaluwarsa
    // }
    // console.log(data)

    const { expiredAt } = data;
    const fiveMinutesInMillis = 5 * 60 * 1000; // 5 menit dalam milidetik
    const expirationTime = new Date(expiredAt).getTime();
    const now = new Date().getTime();
    // console.log(now , expirationTime , data , new Date())
    // console.log(now > expirationTime)
    if (expirationTime - now <= fiveMinutesInMillis && expirationTime - now > 0) {
      // console.log('Kurang dari atau sama dengan 5 menit lagi sebelum kedaluwarsa!');
      await this.authService.updateSession(data.id)
      // Lakukan tindakan yang sesuai, misalnya memberikan notifikasi kepada pengguna
    }

    const session = await this.authService.getSessionRedis(data.id);
    const dbSession = await this.authService.findSession(data.id);
    const { isExpired } = await this.authService.findSession(data.id);

    const user = await this.userGeneralService.getById(dbSession.userId);

    const isFirstLogin = await this.userGeneralService.isFirstLogin(
      dbSession.userId,
    );
    const isDefaultPassword = this.userGeneralService.isDefaultPassword(
      user.password,
    );

    if (isExpired()) throw unauthorizedError('Sesi anda telah berakhir.');
    ctx.session = {
      ...dbSession,
      isFirstLogin,
      isDefaultPassword,
    };

    return true;
  }
}
