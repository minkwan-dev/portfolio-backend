import Joi from 'joi';
import { appEnvValidationSchema } from '@/modules/config/app/app-env.validation';
import { databaseEnvValidationSchema } from '@/modules/config/database/database-env.validation';

export const envValidationSchema = Joi.object({
  ...appEnvValidationSchema,
  ...databaseEnvValidationSchema,
});