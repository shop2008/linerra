import { Response } from 'express';
import { ErrorShowType } from '../../enum/errorShowType';

declare global {
  namespace Express {
    interface Response {
      ok(data?: any): Response;
      fail(message?: string, errorCode?: string, showType?: ErrorShowType, statusCode?: number): Response;
    }
    interface Request {
      context: Record<string, any>
    }
  }
}
