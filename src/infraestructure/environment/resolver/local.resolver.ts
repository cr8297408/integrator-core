import { EnvironmentError } from 'src/core/domain/shared/error/environment';
import {
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
  type ServiceApplicationApi,
} from '../environment.interfaces';

export class LocalResolver implements IEnvironment {
  readonly #env: NodeJS.ProcessEnv = process.env;

  async setup({ ENVIRONMENT }: IEnvironmentDependency): Promise<IEnvConfig> {
    if (ENVIRONMENT === undefined) throw new EnvironmentError('ENVIROMENT');

    const serviceApplicationApi: ServiceApplicationApi = {
      API_PORT: '',
      MONGO_URI: '',
      MONGO_DB_NAME: '',
    };

    serviceApplicationApi.API_PORT = this.#env.API_PORT ?? '';
    serviceApplicationApi.MONGO_URI = this.#env.MONGO_URI ?? '';
    serviceApplicationApi.MONGO_DB_NAME = this.#env.MONGO_DB_NAME ?? '';
    if (serviceApplicationApi.API_PORT === '') throw new EnvironmentError('API_PORT');
    if (serviceApplicationApi.MONGO_URI === '') throw new EnvironmentError('MONGO_URI');
    if (serviceApplicationApi.MONGO_DB_NAME === '') throw new EnvironmentError('MONGO_DB_NAME');

    return {
      ENVIRONMENT,
      ...serviceApplicationApi,
    };
  }
}
