export class SystemError extends Error {
  code: string;
  kind: KindError;
  statusCode?: number = 500;
  details?: {
    message: string;
    errors?: SystemError[];
  };
}

export enum KindError {
  CLIENT = 'client',
  SYSTEM = 'system',
  VALIDATION = 'validation',
  UNKNOW = 'unknown',
  NOINFO = 'no-info',
}
