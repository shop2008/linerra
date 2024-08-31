import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../utils/serviceError';
import { ErrorShowType } from '../enum/errorShowType';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  if (err instanceof ServiceError) {
    res.status(500).json({
      success: false,
      errorCode: err.errorCode,
      errorMessage: err.message,
      showType: ErrorShowType.ERROR_MESSAGE,
      traceId: res.getHeader('X-Trace-Id'),
      host: req.hostname,
    });
    return;
  }

  res.status(500).json({
    success: false,
    errorCode: 'InternalServerError',
    errorMessage: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    showType: ErrorShowType.ERROR_MESSAGE,
    traceId: res.getHeader('X-Trace-Id'),
    host: req.hostname,
  });
};
