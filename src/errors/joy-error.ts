import { CustomError, CustomErrorResult } from "./custom-error";
import { ValidationError } from "joi";
export class JoyError extends CustomError {
  readonly statusCode = 400;
  constructor(private error: ValidationError) {
    super(error.message);
  }
  serializeErrors(): CustomErrorResult[] {
    console.error(this.error.annotate());

    return this.error.details.map((d) => ({
      message: d.message,
      path: d.path,
      pathKey: d.context?.label,
    })) as CustomErrorResult[];
  }
}
