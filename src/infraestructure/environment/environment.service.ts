import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type EnvironmentType, type IEnvConfig } from './environment.interfaces';
import { EnvironmentStrategy } from './environment.strategy';

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
