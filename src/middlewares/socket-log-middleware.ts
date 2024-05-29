import { logger } from '@/logger/logger';
import { Server, Socket } from 'socket.io';

export const socketLogMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const startTime = Date.now();

  socket.onAny((event, ...args) => {
    const endTime = Date.now();
    const eventTime = endTime - startTime;

    const data = {
      message: "SOCKET EVENT CALLED",
      event,
      eventTime,
      handshake: socket.handshake,
      args: args
    };

    logger.socket(data);
  });

  next();
};