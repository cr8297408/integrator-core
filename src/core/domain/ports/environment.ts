import { type IEnvConfig } from '../shared/environment/config';

export interface EnvironmentPort {
  getConfig: () => Promise<IEnvConfig>;
}
