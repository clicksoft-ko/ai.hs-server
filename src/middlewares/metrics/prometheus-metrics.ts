import { Request, Response } from "express";
import client, { Counter, Histogram } from 'prom-client';
import express from 'express';

const app = express();

class PrometheusMetrics {
  constructor() {
    client.collectDefaultMetrics();
  }

  #requestSuccessHistogram = new Histogram({
    name: 'express_success_requests',
    help: 'Express success requests - duration in seconds',
    labelNames: ['path', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });


  #requestFailHistogram = new Histogram({
    name: 'express_fail_requests',
    help: 'Express fail requests - duration in seconds',
    labelNames: ['path', 'method'],
    buckets: [
      0.0001, 0.001, 0.005, 0.01, 0.025, 0.05, 0.075, 0.09, 0.1, 0.25, 0.5, 1,
      2.5, 5, 10,
    ],
  });

  #failureCounter = new Counter({
    name: 'express_requests_failed_count',
    help: 'Express requests that failed',
    labelNames: ['path', 'error', 'method'],
  });

  #isAvailableMetricsUrl(url: string): boolean {
    const excludePaths = 'metrics';
    if (url.includes(excludePaths)) {
      return false;
    }
    return true;
  }

  start(req: Request) {
    const labels = {
      handler: req.path,
      method: req.method,
    };

    const requestSuccessTimer = this.#requestSuccessHistogram.startTimer(labels);
    const requestFailTimer = this.#requestFailHistogram.startTimer(labels);

    const finish = (res: Response) => {
      if (this.#isAvailableMetricsUrl(req.path)) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          requestSuccessTimer();
        } else {
          requestFailTimer();
          this.#failureCounter.labels({ ...labels }).inc(1);
        }
      }
    }

    return finish;
  }

  async getMetricsEndpoint(req: Request, res: Response) {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  }
}

export const metrics = new PrometheusMetrics();