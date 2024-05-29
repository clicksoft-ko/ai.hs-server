import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { WinstonConst } from './winston-const';
declare module 'winston' {
  interface Logger {
    socket: (message: any) => void;
  }
}

winston.addColors(WinstonConst.colors);

const logger = winston.createLogger({
  format: WinstonConst.format,
  transports: [
    new winston.transports.Console(WinstonConst.console),
    new DailyRotateFile(WinstonConst.dailyRotateFile),
  ],
  levels: WinstonConst.levels,
});


interface LoggerErrorArgs {
  error: Error | unknown;
  errorCode: ErrorCodeType;
  path?: string;
  method?: string;
}

type ErrorCodeType = "UNKNOWN" | "MONGODB_CONN"

const loggerError = ({ errorCode, error, path, method }: LoggerErrorArgs) => {
  let message: string;
  let stack: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else {
    message = "알 수 없는 오류 발생";
    stack = undefined;
  }

  logger.error({
    message,
    errorCode,
    stack,
    path: path,
    method: method,
    status: (error as any)?.statusCode ?? 400,
  });
}
export { logger, loggerError }