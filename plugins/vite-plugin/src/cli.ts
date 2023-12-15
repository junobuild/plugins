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

// Subset of CLI configuration
interface AuthConfigData {
  orbiters?: AuthOrbiterConfig[];
}

const isDefaultProfile = (profile: string | undefined | null): boolean =>
  profile === null || profile === undefined || profile === 'default';

const getProfiles = (config: Conf): Record<string, AuthConfigData> | undefined =>
  config.get('profiles');

export const getOrbiters = ({cli, profile}: JunoParams): AuthOrbiterConfig[] | undefined => {
  const config = new Conf({
    projectName: cli === 'dev' ? AUTH_PROJECT_NAME_DEV : AUTH_PROJECT_NAME
  });

  if (!isDefaultProfile(profile)) {
    return getProfiles(config)?.[profile!]?.orbiters;
  }

  return config.get('orbiters');
};
