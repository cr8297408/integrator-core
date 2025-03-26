import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JWTPort } from '../../core/domain/ports/jwt';

@Injectable()
export class JWTAdapter implements JWTPort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: Record<string, any>): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
