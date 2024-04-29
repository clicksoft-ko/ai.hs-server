import Joi from "joi";
import { JoiError } from "../errors/joi-error";
import { NextFunction, Request, Response } from "express";

export const validateBody =
  (schema: Joi.ObjectSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      throw new JoiError(error);
    }

    req.body = value;
    next();
  };

export interface validateRequest<T> extends Request {
  body: T;
}
