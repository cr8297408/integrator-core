import { HttpStatus } from '@nestjs/common';
import { KindError, SystemError } from './system';

export class InvalidPasswordError extends SystemError {
  constructor() {
    super('Invalid password');
    this.code = 'auth/invalid-password-error';
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.name = 'InvalidPasswordError';
    this.kind = KindError.VALIDATION;
    this.details = {
      message: 'Invalid password',
    };
  }
}
