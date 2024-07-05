import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/errors/bad-request-error";

export const requireParams = (paramName: string) => {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.params?.[paramName]) {
      throw new BadRequestError(`[param: ${paramName}]이 누락되었습니다.`);
    }

    next();
  };
}