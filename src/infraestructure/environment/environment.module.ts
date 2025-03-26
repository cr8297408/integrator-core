import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { EnvironmentStrategy } from './environment.strategy';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConfigService, EnvironmentService, EnvironmentStrategy],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
