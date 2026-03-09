import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailHeader } from './content';


@Injectable()
export class MailerService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_AUTH_USERNAME,
                pass: process.env.SMTP_AUTH_PASS
            },
            tls: {
                rejectUnauthorized: true,
                ciphers: 'TLSv1.2', // Ganti dengan versi yang didukung Mailtrap
            },
        });
    }


    async sendMail({ 
      to, 
      subject, 
      html, 
      from = '', 
      cc = null, 
      bcc = null, 
      attachments = null,
      headers = null,
    }) {
        const mailOptions = {
            from,
            to,
            subject,
            html,
            cc,
            bcc,
            attachments,
            headers
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendWelcomeEmail(to: string, code: string, language: string = 'id') {
      const url = `${process.env.FRONTEND_URL}/reset-password?activationCode=${code}&email=${to}`;
      const subject = language === 'id' ? 'Selamat, Anda telah Bergabung pada Program Kurikulum Universitas Terbuka' : 'Congratulations, You have Joined Kurikulum Program Universitas Terbuka'
      const content = language === 'id' 
        ? `
          <h1>Aktivasi Akun Kurikulum Anda</h1>
          <div class="container">
            <p>Selamat Datang di Kurikulum Universitas Terbuka</p>
            <p>Silakan klik tombol di bawah ini untuk melakukan aktivasi akun anda</p>
            <br><p><a href="${url}" class="button">Aktivasi Akun</a></p><br>
            <p>Jika tombol tidak berfungsi, salin dan tempelkan tautan berikut pada browser Anda</p>
            <p><a href="${url}">${url}</a></p>
            <br>
            <p>Terima kasih</p>
          </div>
        `
        : `
          <h1>Activate Your Kurikulum Account</h1>
          <div class="container">
            <p>Welcome to Kurikulum Universitas Terbuka</p>
            <p>Please click button below to activate your account</p>
            <br><p><a href="${url}" class="button">Activate Account</a></p><br>
            <p>If button doesn't work, copy and paste this link below through your browser</p>
            <p><a href="${url}">${url}</a></p>
            <br>
            <p>Thank you</p>
          </div>
        `

      const html = `
        <!DOCTYPE html>
        <html lang="${language}">
        ${EmailHeader}
        <body>
          ${content}
          <div class="footer">
            <p>Copyright &copy; ${new Date().getFullYear()} | Kurikulum Universitas Terbuka</p>
          </div>
        </body>
        </html>        
      `;

      const mailOptions = {
        to,
        subject,
        html,
        headers : {
          "x-priority": "1",
          "x-msmail-priority": "High",
          importance: "high"
        }
      };

      return this.sendMail(mailOptions);
    }

    async sendLupaPasswordEmail(to: string, code: string, language: string = 'id') {
      const url = `${process.env.FRONTEND_URL}/reset-password?resetCode=${code}&email=${to}`;
      const subject = language === 'id' 
        ? 'Reset Password Akun Kurikulum Universitas Terbuka' 
        : 'Your Password Reset Link for Kurikulum Universitas Terbuka'
      const content = language === 'id' 
        ? `
          <h1>Reset Password Akun Kurikulum</h1>
          <div class="container">
            <p>
              Kami menerima permintaan untuk mengatur ulang password untuk akun Anda di Kurikulum Universitas Terbuka. 
              Jika Anda meminta pengaturan ulang ini, silakan klik tautan di bawah ini untuk membuat password baru.
            </p>
            <br><p><a href="${url}" class="button">Reset Password</a></p><br>
            <p>Jika tombol tidak berfungsi, salin dan tempelkan tautan berikut pada browser Anda</p>
            <p><a href="${url}">${url}</a></p>
            <p>
              Tautan ini akan kedaluwarsa dalam 2 jam. 
              Jika Anda tidak meminta pengaturan ulang password, 
              Anda dapat mengabaikan email ini.
            </p>
            <br>
            <p>Terima kasih</p>
          </div>
        `
        : `
          <h1>Reset Password for Kurikulum Account</h1>
          <div class="container">
            <p>
              We received a request to reset your password for your account on Kurikulum Universitas Terbuka. 
              If you requested this reset, please click the link below to create a new password.
            </p>
            <br><p><a href="${url}" class="button">Reset Password</a></p><br>
            <p>If button doesn't work, copy and paste this link below through your browser</p>
            <p><a href="${url}">${url}</a></p>
            <p>
              This link will expire in 2 hours. 
              If you did not request a password reset, you can safely ignore this email.
            </p>
            <br>
            <p>Thank you</p>
          </div>
        `

      const html = `
        <!DOCTYPE html>
        <html lang="${language}">
        ${EmailHeader}
        <body>
          ${content}
          <div class="footer">
            <p>Copyright &copy; ${new Date().getFullYear()} | Kurikulum Universitas Terbuka</p>
          </div>
        </body>
        </html>        
      `;

      const mailOptions = {
        to,
        subject,
        html,
        headers : {
          "x-priority": "1",
          "x-msmail-priority": "High",
          importance: "high"
        }
      };

      return this.sendMail(mailOptions);
    }

    async sendVerificationEmail(to: string, code: string, language: string = 'en') {
        const urlFe = process.env.FRONTEND_URL
        const url = `${urlFe}/verify-account?code=${code}&email=${to}`;
        const subject = language === 'en' 
          ? 'Verify Registration' 
          : 'Verifikasi Registrasi'

        const content = language === 'en' 
          ? `
            <div class="container">
              <p>Thank you for signing up</p>
              <p>Please click the button below to complete the registration process</p>
              <a href="${url}" class="button">Verify Your Account</a>
              <p>If button doesn't work, copy and paste this link below through your browser:</p>
              <p>${url}</p>
              <p>Thank you</p>
            </div>
          `
          : `
            <div class="container">
              <p>Terima kasih telah mendaftar</p>
              <p>Silakan klik tombol di bawah ini untuk menyelesaikan proses registrasi:</p>
              <a href="${url}" class="button">Verifikasi Akun Anda</a>
              <p>Jika tombol tidak berfungsi, salin dan tempelkan URL berikut ke browser Anda:</p>
              <p>${url}</p>
              <p>Terima kasih</p>
            </div>
          `

        const html = `
          <!DOCTYPE html>
          <html lang="id">
          ${EmailHeader}
          <body>
            <h1>${subject}</h1>
            ${content}
            <div class="footer">
              <p>Copyright &copy; ${new Date().getFullYear()} | Kurikulum Universitas Terbuka</p>
            </div>
          </body>
          </html>        
        `;
        const mailOptions = {
            from: '"Kurikulum Universitas Terbuka" <noreply-kurikulum@ecampus.ut.ac.id>',
            to,
            subject,
            html,
        };

        return this.transporter.sendMail(mailOptions);
    }
}
