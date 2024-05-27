import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import { MongooseError } from "mongoose";
import { MongoError } from "@/errors/mongo-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  if (err instanceof MongooseError) {
    const errors = new MongoError(err).serializeErrors()
    return res.status(400).send(errors);
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
