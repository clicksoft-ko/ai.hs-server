import * as util from "util";
import { promises } from "fs";
import mailer from "nodemailer";

const inLineCss = require("nodemailer-juice");

export class MailManager {
  constructor(
    private service: string,
    private host: string,
    private port: number,
    private user: string,
    private pass: string) { }

  private getTransporter() {
    mailer.createTransport({});

    const transporter = mailer.createTransport({
      service: this.service,
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    transporter.use("compile", inLineCss());

    return transporter;
  }

  async sendMail({ subject, html, from, to }: sendMailArgs) {
    const transporter = this.getTransporter();
    const sendMailAsync = util
      .promisify(transporter.sendMail)
      .bind(transporter);

    await sendMailAsync({
      from, // 네이버 아이디
      to, // 수신자 아이디
      subject,
      html,
    });

    transporter.close();
  }
}

interface sendMailArgs {
  subject: string;
  html: string;
  from: string;
  to: string;
}