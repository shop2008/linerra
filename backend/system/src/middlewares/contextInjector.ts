import { Request, Response, NextFunction } from 'express';

export const contextInjector = (req: Request, res: Response, next: NextFunction) => {
  if (!req.context) {
    req.context = {};
  }

  req.context.acceptLanguage = req.headers['accept-language'];
  // req.context.customHeader2 = req.headers['custom-header-2'];
  // req.context.customHeader3 = req.headers['custom-header-3'];

  next();
};
