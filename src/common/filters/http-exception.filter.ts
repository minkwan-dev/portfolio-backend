import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionBody = {
  message?: string | string[];
  error?: string;
};

type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  path: string;
  timestamp: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const body = exception.getResponse() as ExceptionBody;

    const errorResponse: ErrorResponse = {
      statusCode,
      message: body.message ?? 'Internal server error',
      error: body.error,
      path: req.url,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(errorResponse);
  }
}