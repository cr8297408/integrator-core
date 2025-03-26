import { KindError, SystemError } from "./system";


export class EnvironmentError extends SystemError {
  constructor(environmentName: string) {
    super(`Environment variable: ${environmentName} is undefined`);
    this.code = 'environment/set-variable-error';
    this.name = 'EnvironmentError';
    this.kind = KindError.SYSTEM;
    this.details = {
      message: `Environment variable: ${environmentName} is undefined`,
    };
  }
}
