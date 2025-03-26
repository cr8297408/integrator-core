import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { type PasswordHasherPort } from '../../core/domain/ports/password-hasher';

@Injectable()
export class PasswordHasherAdapter implements PasswordHasherPort {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
