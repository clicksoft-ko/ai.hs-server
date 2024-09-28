import { CustomError, ErrorResult } from "./custom-error";

export class GrpcError extends CustomError {
  readonly statusCode = 400;

  constructor(public err: any) {
    super(err.message);
  }

  serializeErrors(): ErrorResult<any> {
    return {
      message: this.err.message,
      error: { ...this.err },
    };
  }
}