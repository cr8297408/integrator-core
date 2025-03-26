import * as jwt from 'jsonwebtoken';
import { JWTPort } from '../../core/domain/ports/jwt';
import { EnvironmentService } from '../environment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTAdapter implements JWTPort {
  
  constructor(private readonly environmentService: EnvironmentService) {}

  async generateToken(payload: string): Promise<string> {
    const { AUTH_JWT_SECRET_KEY, AUTH_JWT_EXPIRES_IN } = await this.environmentService.getConfig();
    return new Promise((resolve, reject) => {
      jwt.sign({ data: payload }, AUTH_JWT_SECRET_KEY, { expiresIn: AUTH_JWT_EXPIRES_IN }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      });
    });
  }
}
