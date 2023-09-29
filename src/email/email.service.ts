import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendMemberJoin(emailAdress: string) {
    const mailOptions: EmailOptions = {
      to: emailAdress,
      subject: '가입을 축하합니다!',
      html: `<h1>가입 성공되었습니다!</h1>`,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
