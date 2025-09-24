import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@knoword.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
