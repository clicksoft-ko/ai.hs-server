import { ecsFormat } from '@elastic/ecs-winston-format'
import dayjs from 'dayjs';
import winston from 'winston'
const { combine, colorize, printf, timestamp } = winston.format;

const env = process.env.NODE_ENV;
const logdir = "./logs";
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(colors);

const logger = winston.createLogger({
  format: env === "production" ? ecsFormat() : undefined,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: combine(timestamp(),
        colorize({ all: true }),
        printf(({ level, message, timestamp, ...props }) => `${dayjs(timestamp).format("YY.MM.DD HH:mm:ss")} ${level}: ${message} ${Object.keys(props).length > 0 ? JSON.stringify(props) : ""}`)),
    }),
    new winston.transports.File({ filename: `${logdir}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logdir}/warn.log`, level: 'warn' }),
    // new winston.transports.File({ filename: `${logdir}/info.log`, level: 'info' }),
    new winston.transports.File({ filename: `${logdir}/http.log`, level: 'http' }),
    // new winston.transports.File({ filename: `${logdir}/combined.log` }),
  ],
  levels,
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