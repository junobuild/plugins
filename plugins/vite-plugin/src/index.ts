import {type Plugin, type UserConfig} from 'vite';
import {
  container as containerConfig,
  internetIdentityId as internetIdentityIdConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig
} from './config';
import {JunoPluginError} from './error';
import type {JunoParams} from './types';

export default function Juno(params?: JunoParams): Plugin {
  return {
    name: 'vite-plugin-juno',
    config({envPrefix}: UserConfig, {mode}: {mode: string; command: string}) {
      try {
        const satelliteId = satelliteIdConfig({params, mode});
        const orbiterId = orbiterIdConfig();
        const internetIdentityId = internetIdentityIdConfig({params, mode});
        const container = containerConfig({params, mode});

        return {
          define: {
            [`import.meta.env.${envPrefix ?? 'VITE_'}SATELLITE_ID`]: JSON.stringify(satelliteId),
            ...(orbiterId !== undefined && {
              [`import.meta.env.${envPrefix ?? 'VITE_'}ORBITER_ID`]: JSON.stringify(orbiterId)
            }),
            ...(internetIdentityId !== undefined && {
              [`import.meta.env.${envPrefix ?? 'VITE_'}INTERNET_IDENTITY_ID`]:
                JSON.stringify(internetIdentityId)
            }),
            ...(container !== undefined && {
              [`import.meta.env.${envPrefix ?? 'VITE_'}CONTAINER`]: JSON.stringify(container)
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
