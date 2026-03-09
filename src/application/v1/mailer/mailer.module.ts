import { Module } from '@nestjs/common';
import { MailerService } from './MailerService';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
