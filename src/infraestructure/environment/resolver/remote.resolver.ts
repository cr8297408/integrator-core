import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { LoggerInstance } from '../../shared/logger';
import {
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
  type ServiceApplicationApi,
} from '../environment.interfaces';
import { GetSecretError } from 'src/core/domain/shared/error/get-secret';
import { EnvironmentError } from 'src/core/domain/shared/error/environment';

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

    if (secretValue.MONGO_URI === undefined || secretValue.MONGO_URI === '')
      throw new EnvironmentError('MONGO_URI');

    if (secretValue.MONGO_DB_NAME === undefined || secretValue.MONGO_DB_NAME === '')
      throw new EnvironmentError('MONGO_DB_NAME');

    return {
      ENVIRONMENT,
      ...secretValue,
    };
  }
}
