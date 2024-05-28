import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorResult } from "../errors/custom-error";
import { MongooseError } from "mongoose";
import { MongoError } from "@/errors/mongo-error";
import { loggerError } from "@/logger/logger";
import _ from '@/types/express';  // errorDetails 확장

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    req.errorDetails = { type: "CustomError", message: err.message };
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  if (err instanceof MongooseError) {
    req.errorDetails = { type: "MongooseError", message: err.message };
    const errors = new MongoError(err).serializeErrors()
    return res.status(400).send(errors);
  }

  loggerError({ errorCode: "UNKNOWN", error: err, path: req.path, method: req.method });

  res.status(400).send({
    message: "Something went wrong",
  } satisfies ErrorResult<any>);
};
