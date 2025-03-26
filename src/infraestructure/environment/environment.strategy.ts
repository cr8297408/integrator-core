import { Injectable } from '@nestjs/common';
import { LocalResolver, RemoteResolver } from './resolver';
import { type EnvironmentType, type IEnvironment } from '../../core/domain/shared/environment/config';
import { StrategyError } from '../../core/domain/shared/error/strategy';

@Injectable()
export class EnvironmentStrategy {
  readonly #strategy: Map<EnvironmentType, IEnvironment>;

  constructor() {
    this.#strategy = new Map();
    this.#strategy.set('local', new LocalResolver());
    this.#strategy.set('develop', new RemoteResolver());
    this.#strategy.set('qa', new RemoteResolver());
    this.#strategy.set('staging', new RemoteResolver());
    this.#strategy.set('production', new RemoteResolver());
  }

  get(environment: EnvironmentType): IEnvironment {
    const strategy = this.#strategy.get(environment);
    if (strategy === undefined) throw new StrategyError('EnvironmentStrategy', environment);
    return strategy;
  }
}
