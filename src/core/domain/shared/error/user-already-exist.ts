import { HttpStatus } from "@nestjs/common";
import { SystemError, KindError } from "./system";

export class UserAlreadyExistError extends SystemError {
    constructor(email: string) {
      super(`Already exist a user with the same email: ${email}`);
      this.code = 'validation/user-already-exist-error';
      this.statusCode = HttpStatus.BAD_REQUEST;
      this.name = 'UserAlreadyExistError';
      this.kind = KindError.VALIDATION;
      this.details = {
        message: `Already exist a user with the same email: ${email}`,
      };
    }
  }
  