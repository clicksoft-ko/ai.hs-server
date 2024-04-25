export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): CustomErrorResult[];
}

export interface CustomErrorResult {
  message: string;
  path: string[];
  pathKey?: string;
}
