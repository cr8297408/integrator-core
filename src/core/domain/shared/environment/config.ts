export type EnvironmentType = 'local' | 'develop' | 'qa' | 'beta' | 'production';

export interface ServiceApplicationApi {
  API_PORT: string;
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  AUTH_JWT_SECRET_KEY: string;
  AUTH_JWT_EXPIRES_IN: string;
  FINANCIAL_CORE_LAMBDA_FUNCTION: string;
}

export interface IEnvConfig extends ServiceApplicationApi {
  ENVIRONMENT: EnvironmentType;
}

export interface IEnvironmentDependency {
  ENVIRONMENT: EnvironmentType;
}

export interface IEnvironment {
  setup: (dependencies: IEnvironmentDependency) => Promise<IEnvConfig>;
}
