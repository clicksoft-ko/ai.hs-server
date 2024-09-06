import { NextFunction, Request, Response } from "express";
import { logger, loggerHttp } from "@/logger/logger";
import { metrics } from "@/middlewares/metrics/prometheus-metrics";


export const httpLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const { finish } = metrics.start(req);

  const logAndFinishMetrics = (error?: Error) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    loggerHttp({ req, res, responseTime });
    finish(res, error);
  };

  res.on('finish', () => logAndFinishMetrics());
  res.on('error', (error) => logAndFinishMetrics(error));

  next();
};
