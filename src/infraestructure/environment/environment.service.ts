import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type EnvironmentType, type IEnvConfig } from '../../core/domain/shared/environment/config';
import { EnvironmentStrategy } from './environment.strategy';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly environmentStrategy: EnvironmentStrategy
  ) {}

  async getConfig(): Promise<IEnvConfig> {
    const ENVIRONMENT = this.configService.get('ENVIRONMENT') as EnvironmentType;
    console.info(`🚀 ~ file: environment.service.ts:15 ~ EnvironmentService ~ getConfig ~ ENVIRONMENT:`, ENVIRONMENT);
    return await this.environmentStrategy.get(ENVIRONMENT).setup({ ENVIRONMENT });
  }
}
