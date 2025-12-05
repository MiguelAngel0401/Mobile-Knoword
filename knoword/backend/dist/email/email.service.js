"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailService = class EmailService {
    mailer;
    constructor(mailer) {
        this.mailer = mailer;
    }
    async sendEmailConfirmation(email, realName, token) {
        const url = `http://localhost:3000/confirm-account?token=${token}`;
        await this.mailer.sendMail({
            to: email,
            subject: '¡Prepárate para la productividad! Confirma tu email en Knoword ✍️',
            html: `
        <div style="background-color: #f7f9fc; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
          <table style="max-width: 540px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #e1e4e8; overflow: hidden;">
            <tr>
              <td style="padding: 32px; text-align: center;">
                <img src="https://knoword.com/favicon.ico" alt="Knoword" style="width: 56px; height: 56px; margin-bottom: 24px;">
                <h1 style="color: #2c3e50; font-size: 28px; margin: 0; font-weight: 600;">
                  ¡Hola, futuro genio del estudio! ✨
                </h1>
                <p style="color: #616e7c; font-size: 16px; line-height: 1.6; margin-top: 16px; margin-bottom: 24px;">
                  ¡Bienvenido a Knoword, **${realName}**! Estamos muy emocionados de que te unas a nuestra comunidad. 
                  <br>
                  Solo un paso más para desbloquear todo tu potencial de aprendizaje. Haz clic en el botón de abajo para confirmar tu email y empezar a aprender con nosotros. 📚
                </p>
                <a href="${url}" style="display: inline-block; padding: 14px 40px; background-color: #5d9cec; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 8px rgba(93, 156, 236, 0.4); transition: background-color 0.3s ease;">
                  Empezar a estudiar 🚀
                </a>
                <p style="color: #aeb6c1; font-size: 12px; margin-top: 32px; line-height: 1.4;">
                  Si no te registraste en Knoword, puedes ignorar este correo. Tus apuntes están a salvo, te lo prometemos. 😉
                </p>
              </td>
            </tr>
          </table>
          <p style="text-align: center; color: #aeb6c1; font-size: 12px; margin-top: 24px;">
            <span style="font-weight: 600;">Knoword © ${new Date().getFullYear()}</span> | Todos los derechos reservados.
          </p>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map