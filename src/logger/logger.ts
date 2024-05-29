import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { WinstonConst } from './winston-const';
import { Request, Response } from 'express'
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
  ev?: string;
}

type ErrorCodeType = "UNKNOWN" | "MONGODB_CONN" | "SOCKET_EV"

const loggerError = ({ errorCode, error, path, method, ev }: LoggerErrorArgs) => {
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
    ev,
    status: (error as any)?.statusCode ?? 400,
  });
}

interface LoggerHttpArgs {
  req: Request;
  res: Response;
  responseTime: number;
}

const loggerHttp = ({ req, res, responseTime }: LoggerHttpArgs) => {
  logger.http({
    message: "API CALLED",
    method: req.method,
    url: req.originalUrl,
    errorDetails: req.errorDetails,
    statusCode: res.statusCode,
    responseTime,
  });
}

interface LoggerSocketArgs {
  ev: string;
  evTime: number;
  room: string;
}

const loggerSocket = ({ ev, evTime, room }: LoggerSocketArgs) => {
  logger.socket({
    message: "SOCKET EV CALLED",
    ev,
    evTime,
    room,
  });
}

export { logger, loggerError, loggerHttp, loggerSocket }