import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'AzureAD') {
  constructor(protected readonly configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/508916a0-7b89-43a1-af4e-72fe15aba5b9/v2.0/.well-known/openid-configuration`,
      clientID: 'ce97164d-180a-48cb-ad8a-d650abf67337',
      validateIssuer: false, // Adjust based on your security requirements
      loggingLevel: 'info',
      passReqToCallback: false,
      authorityType: 'MSSTS', // Set the authority type here
    });
  }

  validate(payload: any) {
    // Your validation logic here
    return payload;
  }
}
