import Joi from 'joi';

export const signUpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email address is required'
  }),
  password: Joi.string()
    .min(8).message('Password must be at least 8 characters long')
    .regex(/[a-z]/).message('Password must contain at least one lowercase letter')
    .regex(/[A-Z]/).message('Password must contain at least one uppercase letter')
    .regex(/\d/).message('Password must contain at least one number')
    .regex(/[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]/).message('Password must contain at least one special character')
    .required().messages({
      'any.required': 'Password is required'
    })
});

export const signInSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Email address is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});
