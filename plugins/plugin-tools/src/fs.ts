import type {JunoConfig, JunoConfigFnOrObject} from '@junobuild/config';
import {
  junoConfigExist as junoConfigExistTools,
  readJunoConfig as readJunoConfigTools,
  type ConfigFilename
} from '@junobuild/config-loader';
import {JunoPluginError} from './error';
import type {ConfigArgs} from './types';

const JUNO_CONFIG_FILE: {filename: ConfigFilename} = {filename: 'juno.config'};

export const readJunoConfig = async ({mode}: ConfigArgs): Promise<JunoConfig> => {
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

export const junoConfigExist = (): Promise<boolean> => junoConfigExistTools(JUNO_CONFIG_FILE);
