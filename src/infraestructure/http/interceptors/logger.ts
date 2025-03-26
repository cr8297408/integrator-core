import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerInstance } from 'src/infraestructure/shared/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const { method, path, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    LoggerInstance.info(`📥 Incoming Request: [${method}] ${path} - IP: ${ip} - User-Agent: ${userAgent}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      LoggerInstance.info(
        `📤 Response Sent: [${method}] ${path} - Status: ${res.statusCode} - Time: ${duration}ms`
      );
    });

    next();
  }
}
