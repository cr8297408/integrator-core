import { EnvironmentError } from 'src/core/domain/shared/error/environment';
import {
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
  type ServiceApplicationApi,
} from '../../../core/domain/shared/environment/config';
export class LocalResolver implements IEnvironment {
  readonly #env: NodeJS.ProcessEnv = process.env;

  async setup({ ENVIRONMENT }: IEnvironmentDependency): Promise<IEnvConfig> {
    if (ENVIRONMENT === undefined) throw new EnvironmentError('ENVIROMENT');

    const serviceApplicationApi: ServiceApplicationApi = {
      API_PORT: '',
      MONGO_URI: '',
      MONGO_DB_NAME: '',
      AUTH_JWT_SECRET_KEY: '',
      AUTH_JWT_EXPIRES_IN: '',
      FINANCIAL_CORE_LAMBDA_FUNCTION: '',
    };

    serviceApplicationApi.API_PORT = this.#env.API_PORT ?? '';
    serviceApplicationApi.MONGO_URI = this.#env.MONGO_URI ?? '';
    serviceApplicationApi.MONGO_DB_NAME = this.#env.MONGO_DB_NAME ?? '';
    serviceApplicationApi.AUTH_JWT_SECRET_KEY = this.#env.AUTH_JWT_SECRET_KEY ?? '';
    serviceApplicationApi.AUTH_JWT_EXPIRES_IN = this.#env.AUTH_JWT_EXPIRES_IN ?? '';
    serviceApplicationApi.FINANCIAL_CORE_LAMBDA_FUNCTION = this.#env.FINANCIAL_CORE_LAMBDA_FUNCTION ?? '';

    if (serviceApplicationApi.API_PORT === '') throw new EnvironmentError('API_PORT');
    if (serviceApplicationApi.MONGO_URI === '') throw new EnvironmentError('MONGO_URI');
    if (serviceApplicationApi.MONGO_DB_NAME === '') throw new EnvironmentError('MONGO_DB_NAME');
    if (serviceApplicationApi.AUTH_JWT_SECRET_KEY === '') throw new EnvironmentError('AUTH_JWT_SECRET_KEY');
    if (serviceApplicationApi.AUTH_JWT_EXPIRES_IN === '') throw new EnvironmentError('AUTH_JWT_EXPIRES_IN');
    if (serviceApplicationApi.FINANCIAL_CORE_LAMBDA_FUNCTION === '')
      throw new EnvironmentError('FINANCIAL_CORE_LAMBDA_FUNCTION');

    return {
      ENVIRONMENT,
      ...serviceApplicationApi,
    };
  }
}
