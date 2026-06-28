import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const now = new Date().toISOString();

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`[${now}] ${method} ${originalUrl} ${statusCode}`);
    });

    next();
  }
}
