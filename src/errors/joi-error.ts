import { CustomError, ErrorResult, ErrorsResult } from "./custom-error";
import Joi, { ValidationError } from "joi";
export class JoiError extends CustomError {
  readonly statusCode = 400;
  constructor(private error: ValidationError) {
    super(error.message);
  }
  serializeErrors(): ErrorResult<any> {
    console.error(this.error.annotate());

    const error = this.error.details.reduce(
      (acc: { [key: string]: string }, cur: Joi.ValidationErrorItem) => {
        if (cur.context?.label) {
          acc[cur.context.label] = cur.message;
        }
        return acc;
      },
      {}
    );

    return {
      message: this.error.message,
      error,
      errors: this.error.details.map((d) => ({
        message: d.message,
        path: d.path,
        pathKey: d.context?.label,
      })) as ErrorsResult[],
    };
  }
}
