declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI?: string;
    JWT_KEY?: string;
    ADMIN_KEY?: string;
    PORT?: string;
    SMTP_SERVICE?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_AUTH_USER?: string;
    SMTP_AUTH_PASS?: string;
  }
}