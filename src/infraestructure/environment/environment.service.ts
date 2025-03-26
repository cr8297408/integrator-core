import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentStrategy } from './environment.strategy';
import { type EnvironmentType, type IEnvConfig } from '../../core/domain/shared/environment/config';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly environmentStrategy: EnvironmentStrategy
  ) {}

  async getConfig(): Promise<IEnvConfig> {
    const ENVIRONMENT = this.configService.get('ENVIRONMENT') as EnvironmentType;
    return await this.environmentStrategy.get(ENVIRONMENT).setup({ ENVIRONMENT });
  }
}
