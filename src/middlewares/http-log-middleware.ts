import { NextFunction, Request, Response } from "express";
import { logger, loggerHttp } from "@/logger/logger";

export const httpLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    loggerHttp({ req, res, responseTime })
  });

  next();
};
