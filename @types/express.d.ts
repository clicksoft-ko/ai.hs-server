import 'express';

declare global {
  namespace Express {
    interface Request {
      errorDetails?: { // http-log-middleware 에 전달할 로그
        type: string;
        message: string;
      };
    }
  }
}

export { }