export class SocketEvError extends Error {
  constructor(message: string, public readonly ev: string) {
    super(message);
  }
}