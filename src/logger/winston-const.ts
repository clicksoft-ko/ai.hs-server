import winston from 'winston'
import { ecsFormat } from '@elastic/ecs-winston-format'
import dayjs from 'dayjs';

const { combine, colorize, printf, timestamp } = winston.format;
const env = process.env.NODE_ENV;

export class WinstonConst {
  static logdir = "./logs";
  static format = env === "production" ? ecsFormat() : undefined;
  static console = {
    level: 'debug',
    format: combine(timestamp(),
      colorize({ all: true }),
      printf(({ level, message, timestamp, ...props }) => `${dayjs(timestamp).format("YY.MM.DD HH:mm:ss")} ${level}: ${message} ${Object.keys(props).length > 0 ? JSON.stringify(props) : ""}`))
  }

  static dailyRotateFile = {
    filename: `${WinstonConst.logdir}/hslog-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level: 'socket',
  }

  static levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    socket: 4,
    debug: 5
  };

  static colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    socket: 'cyan',
  };
}