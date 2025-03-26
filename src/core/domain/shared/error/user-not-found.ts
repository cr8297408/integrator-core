import { HttpStatus } from "@nestjs/common";
import { SystemError, KindError } from "./system";

export class UserNotFoundError extends SystemError {
    constructor(email: string) {
      super(`User not found with the email: ${email}`);
      this.code = 'validation/user-not-found-error';
      this.statusCode = HttpStatus.BAD_REQUEST;
      this.name = 'UserNotFoundError';
      this.kind = KindError.VALIDATION;
      this.details = {
        message: `User not found with the email: ${email}`,
      };
    }
  }
  