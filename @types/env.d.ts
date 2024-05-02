declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI?: string;
    JWT_KEY?: string;
    PORT?: string;
  }
}
