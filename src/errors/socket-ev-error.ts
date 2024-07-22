export class SocketEvError extends Error {
  constructor(public error: SocketIOError, public readonly ev: string) {
    super(error.message);
  }
}

interface SocketIOError {
  status: string;
  message: string;
  error?: { [key: string]: string };
  errorCode?: string;
}