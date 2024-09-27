import { isProduction } from "./env-const";

export class URLConst {
  static CLIENT = isProduction ? process.env.BASE_URL! : "http://localhost:3020";
  static SERVER = isProduction ? process.env.BASE_URL! : "http://localhost:4020";
}