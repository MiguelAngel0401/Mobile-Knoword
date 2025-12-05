import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private mailer;
    constructor(mailer: MailerService);
    sendEmailConfirmation(email: string, realName: string, token: string): Promise<void>;
}
