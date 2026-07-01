import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionBody, ErrorResponse } from '@/setup/filters/error-response.types';

export function buildErrorResponse(
  exception: unknown,
  path: string,
): ErrorResponse {
  const timestamp = new Date().toISOString();

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const body = exception.getResponse() as ExceptionBody;

    return {
      statusCode,
      message: body.message ?? 'Internal server error',
      error: body.error,
      path,
      timestamp,
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    path,
    timestamp,
  };
}
