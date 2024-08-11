import Client from "ssh2-sftp-client";
import { randomUUID } from 'crypto';
import path from "path";
import mime from 'mime-types'

const IMAGES_PATH = "/web/hs/images";

export class SftManager {
  sftp: Client;
  constructor() {
    this.sftp = new Client();
  }

  private getImgPath(fileName: string): string {
    return path.join(IMAGES_PATH, fileName);
  }
  async connect() {
    await this.sftp.connect({
      host: process.env.SFTP_HOST,
      port: +process.env.SFTP_PORT!,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
  }

  async getImage(fileName: string) {
    const remotePath = this.getImgPath(fileName);
    const buffer = await this.sftp.get(remotePath);
    const mimeType = mime.lookup(fileName) as string;

    return {
      buffer,
      mimeType,
    }
  }

  async putImage(file: Express.Multer.File) {
    const uuid = randomUUID();
    const extension = file.originalname.split(".").pop();
    const fileName = `${uuid}.${extension}`
    const remotePath = this.getImgPath(fileName);

    const message = await this.sftp.put(file.buffer, remotePath);
    return {
      message, fileName,
    }
  }

  async deleteImage(fileName: string) {
    const remotePath = this.getImgPath(fileName);
    await this.sftp.delete(remotePath);
  }

  async end() {
    return this.sftp.end().catch(_ => { });
  }
}