import kleur from 'kleur';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_ICP_INDEX_ID,
  DOCKER_ICP_LEDGER_ID,
  DOCKER_INTERNET_IDENTITY_ID,
  DOCKER_SATELLITE_ID
} from './constants';
import {JunoPluginError} from './error';
import type {JunoParams} from './types';

const {yellow, cyan} = kleur;

const JUNO_JSON = join(process.cwd(), 'juno.json');

const useDockerContainer = ({params, mode}: {params?: JunoParams; mode: string}): boolean =>
  params?.container !== undefined && params?.container !== false && mode !== 'production';

export const satelliteId = (args: {params?: JunoParams; mode: string}): string => {
  if (useDockerContainer(args)) {
    return DOCKER_SATELLITE_ID;
  }

  return junoJsonSatelliteId();
};

const junoJsonSatelliteId = (): string => {
  assertJunoJson();

  const {
    satellite: {satelliteId}
  } = readJunoJson();

  // Type wise cannot be null but given that we are reading from a JSON file, better be sure.
  if (satelliteId === undefined) {
    throw new JunoPluginError(
      `Your configuration is invalid. Cannot resolved a ${yellow('satelliteId')} in your ${cyan(
        'juno.json'
      )} file.`
    );
  }

  return satelliteId;
};

export const orbiterId = (): string | undefined => {
  assertJunoJson();

  const {orbiter} = readJunoJson();

  return orbiter?.orbiterId;
};

export const icpIds = (args: {
  params?: JunoParams;
  mode: string;
}): {internetIdentityId: string; icpLedgerId: string; icpIndexId: string} | undefined => {
  if (useDockerContainer(args)) {
    return {
      internetIdentityId: DOCKER_INTERNET_IDENTITY_ID,
      icpLedgerId: DOCKER_ICP_LEDGER_ID,
      icpIndexId: DOCKER_ICP_INDEX_ID
    };
  }

  return undefined;
};

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

// TODO: Use the same types as those defined in the CLI.
const readJunoJson = (): {satellite: {satelliteId: string}; orbiter?: {orbiterId: string}} => {
  const buffer = readFileSync(JUNO_JSON);
  return JSON.parse(buffer.toString('utf-8'));
};

const assertJunoJson = () => {
  if (!existsSync(JUNO_JSON)) {
    throw new JunoPluginError(
      `No ${yellow('juno.json')} found. Run ${cyan('juno init')} to configure your dapp.`
    );
  }
};
