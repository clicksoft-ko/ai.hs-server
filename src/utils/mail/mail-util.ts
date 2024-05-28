import fs from 'fs/promises'
import path from 'path';
import { MailManager } from './mail-manager';
import { URLConst } from '@/constants/url-const';

interface Args {
  to: string;
  token: string;
}

export async function sendChangePasswordEmail({ to, token }: Args) {
  const filePath = path.join(__dirname, "change-password.html")
  const html = await fs.readFile(filePath);

  const replacedHtml = html.toString()
    .replaceAll("@title", "클릭소프트 웹 문진표 비밀번호 찾기")
    .replaceAll("@url", `${URLConst.CLIENT}/${token}/changepw`)
    .replaceAll("@logoSrc", `${URLConst.SERVER}/images/click_icon.png`)

  const mailManager = new MailManager(
    process.env.SMTP_SERVICE!,
    process.env.SMTP_HOST!,
    +process.env.SMTP_PORT!,
    process.env.SMTP_AUTH_USER!,
    process.env.SMTP_AUTH_PASS!
  );

  await mailManager.sendMail({
    subject: "클릭소프트 웹 문진표 비밀번호 찾기",
    html: replacedHtml,
    from: process.env.SMTP_AUTH_USER!,
    to: to,
  })
}