import kleur from 'kleur';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {getOrbiters} from './cli';
import {JunoPluginError} from './error';
import type {JunoParams} from './types';

const {yellow, cyan} = kleur;

const JUNO_JSON = join(process.cwd(), 'juno.json');
const DFX_LOCAL_CANISTER_IDS = join(process.cwd(), '.dfx', 'local', 'canister_ids.json');

export const satelliteId = ({
  params: {junolator},
  mode
}: {
  params: JunoParams;
  mode: string;
}): string => {
  if (junolator === true && mode === 'development') {
    return junolatorSatelliteId();
  }

  return junoJsonSatelliteId();
};

const junolatorSatelliteId = (): string => {
  if (!existsSync(DFX_LOCAL_CANISTER_IDS)) {
    throw new JunoPluginError(`No local configuration found for ${yellow('junolator')}.`);
  }

  const buffer = readFileSync(DFX_LOCAL_CANISTER_IDS);
  const {
    satellite: {local: satelliteId}
  } = JSON.parse(buffer.toString('utf-8'));

  if (satelliteId === undefined) {
    throw new JunoPluginError(
      `Your configuration is invalid. Cannot resolved a ${yellow(
        'satelliteId'
      )} in your local configuration.`
    );
  }

  return satelliteId;
};

const junoJsonSatelliteId = (): string => {
  if (!existsSync(JUNO_JSON)) {
    throw new JunoPluginError(
      `No ${yellow('juno.json')} found. Run ${cyan('juno init')} to configure your dapp.`
    );
  }

  const buffer = readFileSync(JUNO_JSON);
  const {
    satellite: {satelliteId}
  } = JSON.parse(buffer.toString('utf-8'));

  if (satelliteId === undefined) {
    throw new JunoPluginError(
      `Your configuration is invalid. Cannot resolved a ${yellow('satelliteId')} in your ${cyan(
        'juno.json'
      )} file.`
    );
  }

  return satelliteId;
};

export const orbiterId = (params: JunoParams): string | undefined => {
  const orbiters = getOrbiters(params);
  return orbiters?.[0].p;
};
