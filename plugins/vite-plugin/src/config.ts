import {
  junoConfigExist as junoConfigExistTools,
  readJunoConfig as readJunoConfigTools,
  type ConfigFilename
} from '@junobuild/cli-tools';
import type {JunoConfig, JunoConfigFnOrObject} from '@junobuild/config';
import kleur from 'kleur';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_SATELLITE_ID,
  ICP_INDEX_ID,
  ICP_LEDGER_ID,
  INTERNET_IDENTITY_ID
} from './constants';
import {JunoPluginError} from './error';
import type {ConfigArgs, JunoParams} from './types';

const {cyan} = kleur;

const useDockerContainer = ({params, mode}: ConfigArgs): boolean =>
  params?.container !== undefined && params?.container !== false && mode === 'development';

export const satelliteId = async (args: ConfigArgs): Promise<string> => {
  if (useDockerContainer(args)) {
    return DOCKER_SATELLITE_ID;
  }

  return await junoJsonSatelliteId(args);
};

const junoJsonSatelliteId = async ({mode}: ConfigArgs): Promise<string> => {
  await assertJunoConfig();

  const {
    satellite: {satellitesIds, satelliteId: satelliteIdUser}
  } = await readJunoConfig({mode});

  const satelliteId = satellitesIds?.[mode] ?? satelliteIdUser;

  if (satelliteId === undefined) {
    throw new JunoPluginError(
      `Your configuration is invalid. A satellite ID for ${mode} must be set in your configuration file.`
    );
  }

  return satelliteId;
};

export const orbiterId = async (args: ConfigArgs): Promise<string | undefined> => {
  if (useDockerContainer(args)) {
    return undefined;
  }

  await assertJunoConfig();

  const config = await readJunoConfig(args);

  return config?.orbiter?.orbiterId;
};

export const icpIds = (args: {
  params?: JunoParams;
  mode: string;
}): {internetIdentityId: string; icpLedgerId: string; icpIndexId: string} | undefined => ({
  internetIdentityId: INTERNET_IDENTITY_ID,
  icpLedgerId: ICP_LEDGER_ID,
  icpIndexId: ICP_INDEX_ID
});

export const container = ({
  params,
  mode
}: {
  params?: JunoParams;
  mode: string;
}): string | undefined => {
  if (useDockerContainer({params, mode})) {
    return params?.container === true
      ? DOCKER_CONTAINER_URL
      : params?.container !== false
        ? params?.container
        : undefined;
  }

  return undefined;
};

const JUNO_CONFIG_FILE: {filename: ConfigFilename} = {filename: 'juno.config'};

export const readJunoConfig = async ({mode}: ConfigArgs): Promise<JunoConfig> => {
  const config = (userConfig: JunoConfigFnOrObject): JunoConfig =>
    typeof userConfig === 'function' ? userConfig({mode}) : userConfig;

  return await readJunoConfigTools({
    ...JUNO_CONFIG_FILE,
    config
  });
};

const assertJunoConfig = async () => {
  const exist = await junoConfigExistTools(JUNO_CONFIG_FILE);

  if (!exist) {
    throw new JunoPluginError(
      `No Juno configuration found. Run ${cyan('juno init')} to configure your dapp.`
    );
  }
};
