// Duplicate CLI code. There are probably ways to extract some code to avoid duplication.

// TODO: fix TypeScript declaration import of conf
// @ts-expect-error
import Conf from 'conf';
import type {JunoParams} from './types';

const AUTH_PROJECT_NAME = 'juno';
const AUTH_PROJECT_NAME_DEV = 'juno-dev';

interface AuthOrbiterConfig {
  p: string; // principal
  n?: string; // name
}

type AuthProfile = 'default' | string;

// Subset of CLI configuration
interface AuthConfigData {
  orbiters?: AuthOrbiterConfig[];
}

const getUse = (config: Conf): AuthProfile | undefined => config.get('use');

const isDefaultProfile = (use: AuthProfile | undefined | null): boolean =>
  use === null || use === undefined || use === 'default';

const getProfiles = (config: Conf): Record<string, AuthConfigData> | undefined =>
  config.get('profiles');

export const getOrbiters = ({
  config: paramsConfig
}: JunoParams): AuthOrbiterConfig[] | undefined => {
  const config = new Conf({
    projectName: paramsConfig === 'dev' ? AUTH_PROJECT_NAME_DEV : AUTH_PROJECT_NAME
  });

  const use = getUse(config);

  if (!isDefaultProfile(use)) {
    return getProfiles(config)?.[use!]?.orbiters;
  }

  return config.get('orbiters');
};
