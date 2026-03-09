import { Injectable, BadRequestException, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthSsoService {
    private readonly logger = new Logger(AuthSsoService.name);
    private readonly backendApiUrl: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.backendApiUrl = this.configService.get<string>('BACKEND_API_URL');
    }

    async authSso(preferred_username: String, name: String): Promise<any> {
        return { "status": 200, "message": "success", "email_365": preferred_username, "name": name };
    }
}
