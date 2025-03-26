import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import {
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
  type ServiceApplicationApi,
} from '../../../core/domain/shared/environment/config';
import { EnvironmentError } from '../../../core/domain/shared/error/environment';
import { GetSecretError } from '../../../core/domain/shared/error/get-secret';
import { LoggerInstance } from '../../shared/logger';

type SecretsValuesParameters = ServiceApplicationApi;

export class RemoteResolver implements IEnvironment {
  readonly #env: NodeJS.ProcessEnv = process.env;

  async setup({ ENVIRONMENT }: IEnvironmentDependency): Promise<IEnvConfig> {
    if (ENVIRONMENT === undefined) throw new EnvironmentError('ENVIROMENT');

    const REGION_AWS = this.#env.REGION_AWS;
    const SECRET_NAME_AWS = this.#env.SECRET_NAME_AWS;

    if (REGION_AWS === undefined) throw new EnvironmentError('REGION_AWS');
    if (SECRET_NAME_AWS === undefined) throw new EnvironmentError('SECRET_NAME_AWS');

    let secretValue: SecretsValuesParameters = {
      API_PORT: '',
      MONGO_DB_NAME: '',
      MONGO_URI: '',
      AUTH_JWT_SECRET_KEY: '',
      AUTH_JWT_EXPIRES_IN: '',
      FINANCIAL_CORE_LAMBDA_FUNCTION: '',
    };

    try {
      const client = new SecretsManagerClient({ region: REGION_AWS });
      const command = new GetSecretValueCommand({
        SecretId: SECRET_NAME_AWS,
        VersionStage: 'AWSCURRENT',
      });
      const response = await client.send(command);

      if (response.SecretString !== undefined) {
        secretValue = JSON.parse(response.SecretString);
      }
    } catch (error) {
      LoggerInstance.warn(`Error->EnvConfig->GetSecrets->${JSON.stringify(error)}`);
      throw new GetSecretError();
    }

    if (secretValue.MONGO_URI === undefined || secretValue.MONGO_URI === '') throw new EnvironmentError('MONGO_URI');

    if (secretValue.MONGO_DB_NAME === undefined || secretValue.MONGO_DB_NAME === '')
      throw new EnvironmentError('MONGO_DB_NAME');

    if (secretValue.AUTH_JWT_SECRET_KEY === undefined || secretValue.AUTH_JWT_SECRET_KEY === '')
      throw new EnvironmentError('AUTH_JWT_SECRET_KEY');

    if (secretValue.AUTH_JWT_EXPIRES_IN === undefined || secretValue.AUTH_JWT_EXPIRES_IN === '')
      throw new EnvironmentError('AUTH_JWT_EXPIRES_IN');

    if (secretValue.FINANCIAL_CORE_LAMBDA_FUNCTION === undefined || secretValue.FINANCIAL_CORE_LAMBDA_FUNCTION === '')
      throw new EnvironmentError('FINANCIAL_CORE_LAMBDA_FUNCTION');

    return {
      ENVIRONMENT,
      ...secretValue,
    };
  }
}
