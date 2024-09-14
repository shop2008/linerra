import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ServiceError } from '../utils/serviceError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new ServiceError(errorMessage, "ValidateError"));
    }
    next();
  };
};
