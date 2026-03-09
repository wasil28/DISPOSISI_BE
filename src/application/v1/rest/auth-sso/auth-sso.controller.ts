// src/application/v1/rest/auth-sso/auth-sso.controller.ts

import { Controller, Get, Logger, Req } from '@nestjs/common';
import { AuthSsoService } from './auth-sso.service';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Controller('/api/v1/auth-sso')
// @UseGuards(AuthGuard()) // Aktifkan jika Anda ingin menggunakan AuthGuard
export class AuthSsoController {
  private readonly backendApiUrl: string;
  private logger = new Logger(AuthSsoController.name); // Gunakan nama controller untuk logger

  constructor(
    private readonly authSsoService: AuthSsoService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    this.backendApiUrl = this.configService.get<string>('BACKEND_API_URL');
  }

  @Get()
  async getAuthSso(@Req() request): Promise<any> {
    const { sub, preferred_username, name } = request.user;
    this.logger.log(`User ID: ${sub}, Email: ${preferred_username}`);
    return this.authSsoService.authSso(preferred_username, name);
  }
}
