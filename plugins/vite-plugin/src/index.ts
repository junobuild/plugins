import type {ConfigArgs, JunoParams} from '@junobuild/plugin-tools';
import {
  container as containerConfig,
  icpIds as icpIdsConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig
} from '@junobuild/plugin-tools';
import {type Plugin, type UserConfig} from 'vite';

export default function Juno(params?: JunoParams): Plugin {
  return {
    name: 'vite-plugin-juno',
    async config({envPrefix}: UserConfig, {mode}: {mode: string; command: string}) {
      const args: ConfigArgs = {params, mode};

      const [satelliteId, orbiterId, icpIds, container] = await Promise.all([
        satelliteIdConfig(args),
        orbiterIdConfig(args),
        Promise.resolve(icpIdsConfig()),
        Promise.resolve(containerConfig(args))
      ]);

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
    }
  };
}
