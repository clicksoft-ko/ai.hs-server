import { NextFunction, Request, Response } from "express";
import { logger, loggerHttp } from "@/logger/logger";
import { metrics } from "@/middlewares/metrics/prometheus-metrics";


export const httpLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const finishMetrics = metrics.start(req);

  const logAndFinishMetrics = () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    loggerHttp({ req, res, responseTime });
    finishMetrics(res);
  };

  res.on('finish', logAndFinishMetrics);
  res.on('error', logAndFinishMetrics);

  next();
};
