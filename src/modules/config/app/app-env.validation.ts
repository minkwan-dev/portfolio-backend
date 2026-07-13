import Joi from 'joi';

export const appEnvValidationSchema = {
  PORT: Joi.number().port().default(3000),
  ALLOWED_ORIGINS: Joi.string().optional().allow(''),
};