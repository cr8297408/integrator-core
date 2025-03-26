import { HttpStatus } from '@nestjs/common';
import { KindError, SystemError } from './system';

export class ProductNotFoundError extends SystemError {
  constructor(id: string) {
    super(`Product not found with id: ${id}`);
    this.code = 'product/not-found-error';
    this.statusCode = HttpStatus.NOT_FOUND;
    this.name = 'ProductNotFoundError';
    this.kind = KindError.VALIDATION;
    this.details = {
      message: `Product not found with id: ${id}`,
    };
  }
}
