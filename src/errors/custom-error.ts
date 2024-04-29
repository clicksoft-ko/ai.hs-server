export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string, private key?: string) {
    super(message);
  }

  serializeErrors(): ErrorResult<any> {
    return {
      message: this.message,
      error: this.key ? { [this.key]: this.message } : {},
    };
  }
}

export interface ErrorResult<T extends { [key: string]: any }> {
  message: string;
  error?: T & { _form?: string };
  errors?: ErrorsResult[];
}

export interface ErrorsResult {
  path: string[];
  pathKey?: string;
}
