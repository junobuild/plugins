import type {JunoConfig, JunoConfigFnOrObject} from '@junobuild/config';
import {
  junoConfigExist as junoConfigExistTools,
  readJunoConfig as readJunoConfigTools,
  type ConfigFilename
} from '@junobuild/config-loader';
import {
  CMC_ID,
  DOCKER_CONTAINER_URL,
  DOCKER_SATELLITE_ID,
  ICP_INDEX_ID,
  ICP_LEDGER_ID,
  INTERNET_IDENTITY_ID,
  MODE_DEVELOPMENT,
  NNS_GOVERNANCE_ID
} from './constants';
import {JunoPluginError} from './error';
import type {ConfigArgs, IcpIds, JunoParams} from './types';

export const useDockerContainer = ({params, mode}: ConfigArgs): boolean =>
  params?.container !== false &&
  (params?.container === undefined || params?.container === true
    ? mode === MODE_DEVELOPMENT
    : (params?.container?.modes ?? [MODE_DEVELOPMENT]).includes(mode));

export const satelliteId = async (args: ConfigArgs): Promise<string> => {
  if (useDockerContainer(args)) {
    return await containerSatelliteId(args);
  }

  return await junoConfigSatelliteId(args);
};

const junoConfigSatelliteId = async ({mode}: ConfigArgs): Promise<string> => {
  await assertJunoConfig();

  const config = await readJunoConfig({mode});

  if (config === undefined || !('satellite' in config)) {
    throw new JunoPluginError(`No configuration exported for ${mode}.`);
  }

  const {
    satellite: {ids, satelliteId: deprecatedSatelliteId, id}
  } = await readJunoConfig({mode});

  const satelliteId = ids?.[mode] ?? id ?? deprecatedSatelliteId;

  if (satelliteId === undefined) {
    if (mode === MODE_DEVELOPMENT) {
      throw new JunoPluginError(
        `Your configuration is invalid. A Satellite ID for ${mode} must be provided.`
      );
    }

    throw new JunoPluginError(
      `Your project needs a Satellite for ${mode}. Create one at https://console.juno.build and set its ID in your configuration file.`
    );
  }

  return satelliteId;
};

const containerSatelliteId = async ({mode}: ConfigArgs): Promise<string> => {
  const exist = await junoConfigExist();

  if (!exist) {
    return DOCKER_SATELLITE_ID;
  }

  const config = await readJunoConfig({mode});

  if (config == undefined || !('satellite' in config)) {
    return DOCKER_SATELLITE_ID;
  }

  const {
    satellite: {ids}
  } = config;

  return ids?.[MODE_DEVELOPMENT] ?? DOCKER_SATELLITE_ID;
};

export const orbiterId = async (args: ConfigArgs): Promise<string | undefined> => {
  if (useDockerContainer(args)) {
    return undefined;
  }

  return await junoConfigOrbiterId(args);
};

const junoConfigOrbiterId = async (args: ConfigArgs): Promise<string | undefined> => {
  await assertJunoConfig();

  const config = await readJunoConfig(args);

  return config?.orbiter?.id ?? config?.orbiter?.orbiterId;
};

export const icpIds = (): IcpIds | undefined => ({
  internetIdentityId: INTERNET_IDENTITY_ID,
  icpLedgerId: ICP_LEDGER_ID,
  icpIndexId: ICP_INDEX_ID,
  nnsGovernanceId: NNS_GOVERNANCE_ID,
  cmcId: CMC_ID
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
        ? (params?.container?.url ?? DOCKER_CONTAINER_URL)
        : undefined;
  }

  return undefined;
};

const JUNO_CONFIG_FILE: {filename: ConfigFilename} = {filename: 'juno.config'};

const readJunoConfig = async ({mode}: ConfigArgs): Promise<JunoConfig> => {
  const config = (userConfig: JunoConfigFnOrObject): JunoConfig =>
    typeof userConfig === 'function' ? userConfig({mode}) : userConfig;

  return await readJunoConfigTools({
    ...JUNO_CONFIG_FILE,
    config
  });
};

export const assertJunoConfig = async () => {
  const exist = await junoConfigExist();

  if (!exist) {
    throw new JunoPluginError(
      `No Juno configuration found. Run "juno init" to configure your dapp.`
    );
  }
};

const junoConfigExist = (): Promise<boolean> => junoConfigExistTools(JUNO_CONFIG_FILE);
