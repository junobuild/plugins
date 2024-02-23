import {type Plugin, type UserConfig} from 'vite';
import {
  container as containerConfig,
  icpIds as internetIdentityIdConfig,
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
        const icpIds = internetIdentityIdConfig({params, mode});
        const container = containerConfig({params, mode});

        const prefix = `import.meta.env.${envPrefix ?? 'VITE_'}`;

        return {
          define: {
            [`${prefix}SATELLITE_ID`]: JSON.stringify(satelliteId),
            ...(orbiterId !== undefined && {
              [`${prefix}ORBITER_ID`]: JSON.stringify(orbiterId)
            }),
            ...(icpIds?.internetIdentityId !== undefined && {
              [`${prefix}INTERNET_IDENTITY_ID`]: JSON.stringify(icpIds.internetIdentityId)
            }),
            ...(icpIds?.icpLedgerId !== undefined && {
              [`${prefix}ICP_LEDGER_ID`]: JSON.stringify(icpIds.icpLedgerId)
            }),
            ...(icpIds?.icpIndexId !== undefined && {
              [`${prefix}ICP_INDEX_ID`]: JSON.stringify(icpIds.icpIndexId)
            }),
            ...(container !== undefined && {
              [`${prefix}CONTAINER`]: JSON.stringify(container)
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
