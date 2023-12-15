import {type Plugin, type UserConfig} from 'vite';
import {orbiterId as orbiterIdConfig, satelliteId as satelliteIdConfig} from './config';
import {JunoPluginError} from './error';
import type {JunoParams} from './types';

export default function Juno(params: JunoParams = {config: 'prod'}): Plugin {
  return {
    name: 'vite-plugin-juno',
    config({envPrefix}: UserConfig, _env: {mode: string; command: string}) {
      try {
        const satelliteId = satelliteIdConfig();
        const orbiterId = orbiterIdConfig(params);

        return {
          define: {
            [`import.meta.env.${envPrefix ?? 'VITE_'}SATELLITE_ID`]: JSON.stringify(satelliteId),
            ...(orbiterId !== undefined && {
              [`import.meta.env.${envPrefix ?? 'VITE_'}ORBITER_ID`]: JSON.stringify(orbiterId)
            })
          }
        };
      } catch (err: unknown) {
        if (err instanceof JunoPluginError) {
          console.log(err.message);
          return {};
        }

        console.error(err);
        return {};
      }
    }
  };
}
