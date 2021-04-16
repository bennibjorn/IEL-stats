import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CacheBreakerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('Cache breaker');
    use(req: Request, res: Response, next: NextFunction) {
        const refreshCache = req.query.refreshCache;
        const cacheSecret = req.query.cacheSecret;
        console.log(refreshCache, cacheSecret);
        next();
    }
}
