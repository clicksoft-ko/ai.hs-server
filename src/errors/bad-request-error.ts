import { CustomError, ErrorResult } from "./custom-error";

export class BadRequestError extends CustomError {
  readonly statusCode = 400;

  constructor(public message: string, key?: string) {
    super(message, key);
  }
}
