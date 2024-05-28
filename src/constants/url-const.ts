const isProudction = process.env.NODE_ENV! === 'production'
export class URLConst {
  static CLIENT = isProudction ? process.env.BASE_URL! : "http://localhost:3020";
  static SERVER = isProudction ? process.env.BASE_URL! : "http://localhost:4020";
}