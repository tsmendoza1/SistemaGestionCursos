import { Request, Response, NextFunction } from 'express';

interface Metrics {
    requestCount: number;
    totalResponseTime: number;
    errors: number;
}

const metrics: Metrics = {
    requestCount: 0,
    totalResponseTime: 0,
    errors: 0,
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        metrics.requestCount++;
        metrics.totalResponseTime += duration;

        if (res.statusCode >= 400) {
            metrics.errors++;
        }

        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });

    next();
};

export const healthCheck = (req: Request, res: Response) => {
    const avgResponseTime = metrics.requestCount > 0
        ? (metrics.totalResponseTime / metrics.requestCount).toFixed(2)
        : 0;

    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        metrics: {
            requestCount: metrics.requestCount,
            averageResponseTime: `${avgResponseTime}ms`,
            errors: metrics.errors,
        },
    });
};
