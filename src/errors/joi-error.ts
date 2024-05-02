import { flattenJoiError } from "health-screening-shared/joi";
import { CustomError, ErrorResult, ErrorsResult } from "./custom-error";
import Joi, { ValidationError } from "joi";

export class JoiError extends CustomError {
  readonly statusCode = 400;
  constructor(private error: ValidationError) {
    super(error.message);
  }
  serializeErrors(): ErrorResult<any> {
    console.error(this.error.annotate());

    return {
      message: this.error.message,
      error: flattenJoiError(this.error),
      errors: this.error.details.map((d) => ({
        message: d.message,
        path: d.path,
        pathKey: d.context?.label,
      })) as ErrorsResult[],
    };
  }
}
