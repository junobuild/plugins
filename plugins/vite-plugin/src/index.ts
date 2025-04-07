import {
  type ConfigArgs,
  type JunoParams,
  JunoPluginError,
  initConfig
} from '@junobuild/plugin-tools';
import {type Plugin, type UserConfig} from 'vite';

/**
 * A Vite plugin to integrate Juno.
 * @param {JunoParams} [params] - The Juno configuration parameters.
 * @returns {Plugin} The Vite plugin.
 */
export default function Juno(params?: JunoParams): Plugin {
  return {
    name: 'vite-plugin-juno',
    // eslint-disable-next-line local-rules/prefer-object-params
    async config({envPrefix}: UserConfig, {mode}: {mode: string; command: string}) {
      try {
        const args: ConfigArgs = {params, mode};

        const {satelliteId, orbiterId, icpIds, container} = await initConfig(args);

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
            ...(icpIds?.nnsGovernanceId !== undefined && {
              [`${prefix}NNS_GOVERNANCE_ID`]: JSON.stringify(icpIds.nnsGovernanceId)
            }),
            ...(icpIds?.cmcId !== undefined && {
              [`${prefix}CMC_ID`]: JSON.stringify(icpIds.cmcId)
            }),
            ...(container !== undefined && {
              [`${prefix}CONTAINER`]: JSON.stringify(container)
            })
          }
        };
      } catch (err: unknown) {
        if (err instanceof JunoPluginError && mode !== 'production') {
          console.warn(err.message);
          return {};
        }

        throw err;
      }
    }
  };
}
