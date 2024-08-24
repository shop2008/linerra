import { Request, Response, NextFunction } from 'express';
import { v4 as uuidV4 } from 'uuid';

export const trace = async (req: Request, res: Response, next: NextFunction) => {
  const traceId = req.headers['x-amzn-trace-id'] || uuidV4();

  // 也可以将 traceId 添加到响应头中
  res.set('X-Trace-Id', traceId);

  // 继续处理请求
  next();
};
