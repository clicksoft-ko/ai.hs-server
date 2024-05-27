import { flattenJoiError } from "health-screening-shared/joi";
import { CustomError, ErrorResult, ErrorsResult } from "./custom-error";
import { MongooseError } from "mongoose";

export class MongoError extends CustomError {
  readonly statusCode = 400;
  constructor(private error: MongooseError) {
    super(error.message);
  }
  serializeErrors(): ErrorResult<any> {
    return {
      message: this.error.message,
      error: { _form: this.error.message }
    };
  }
}
