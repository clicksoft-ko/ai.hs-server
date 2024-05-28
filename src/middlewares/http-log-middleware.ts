import { NextFunction, Request, Response } from "express";
import { logger } from "@/logger/logger";

export const httpLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const data = { message: "API CALLED", method: req.method, url: req.originalUrl, responseTime, statusCode: res.statusCode, errorDetails: req.errorDetails }

    logger.http(data);
  });

  next();
};
