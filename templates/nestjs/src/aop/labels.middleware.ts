import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { LABELS, START_NOW, REQ_ID } from './constant';

/**
 * http全局标签中间件
 * @param req
 * @param res
 * @param next
 */
export function HTTPLabelsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req[LABELS]) {
    req[LABELS] = {};
  }
  req[LABELS][REQ_ID] = randomUUID();
  req[LABELS][START_NOW] = Date.now();
  next();
}
