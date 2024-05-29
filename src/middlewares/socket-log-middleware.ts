import { loggerSocket } from '@/logger/logger';
import { Socket } from 'socket.io';

export const socketLogMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const startTime = Date.now();

  socket.onAny((event, ...args) => {
    const endTime = Date.now();
    const eventTime = endTime - startTime;

    // loggerSocket({ event, eventTime, key: args?.[0]?.key });
  });

  next();
};