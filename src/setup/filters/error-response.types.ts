export type ExceptionBody = {
  message?: string | string[];
  error?: string;
};

export type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  path: string;
  timestamp: string;
};
