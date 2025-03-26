import { ILoggerPort } from 'src/core/domain/ports/logger';
import { createLogger, transports, format, type Logger as WLogger } from 'winston';

class Logger implements ILoggerPort {
  private static _instance: Logger;
  private readonly loggerInstance: WLogger;

  static getInstance(): Logger {
    if (this._instance === undefined) this._instance = new Logger();
    return this._instance;
  }

  constructor() {
    this.loggerInstance = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }: { timestamp: string; level: string; message: string }): string => {
            return `[${level}][${timestamp}]: ${message}`;
          }
        )
      ),
    });
  }

  info(message: string): void {
    this.loggerInstance.info(message);
  }

  debug(message: string): void {
    this.loggerInstance.debug(message);
  }

  warn(message: string): void {
    this.loggerInstance.warn(message);
  }

  error(message: string): void {
    this.loggerInstance.error(message);
  }
}

export const LoggerInstance = Logger.getInstance();
