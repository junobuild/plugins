import kleur from 'kleur';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {getOrbiters} from './cli';
import {JunoPluginError} from './error';
import type {JunoParams} from './types';

const {yellow, cyan} = kleur;

const JUNO_CONFIG = 'juno.json';

export const satelliteId = (): string => {
  const JUNO_JSON = join(process.cwd(), 'juno.json');

  if (!existsSync(JUNO_JSON)) {
    throw new JunoPluginError(
      `No ${yellow('juno.json')} found. Run ${cyan('juno init')} to configure your dapp.`
    );
  }

  const buffer = readFileSync(JUNO_CONFIG);
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
