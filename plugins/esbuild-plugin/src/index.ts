import {
  type ConfigArgs,
  type JunoParams,
  JunoPluginError,
  initConfig
} from '@junobuild/plugin-tools';
import type {Plugin, PluginBuild} from 'esbuild';

export interface JunoOptions {
  emulator?: JunoParams;
  envPrefix?: string;
}

export const juno = (options?: JunoOptions): Plugin => ({
    name: 'esbuild-plugin-juno',
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    setup(build: PluginBuild) {
      const mode = process.env.NODE_ENV;

      const defineConfig = async () => {
        const {emulator, envPrefix} = options ?? {};

        const args: ConfigArgs = {params: emulator, mode: mode ?? 'production'};

        try {
          const {satelliteId, orbiterId, icpIds, container, authClientIds} = await initConfig(args);

          const prefix = `process.env.${envPrefix ?? ''}`;

          const defines = {
            [`${prefix}SATELLITE_ID`]: satelliteId,
            ...(orbiterId !== undefined && {
              [`${prefix}ORBITER_ID`]: orbiterId
            }),
            ...(icpIds?.internetIdentityId !== undefined && {
              [`${prefix}INTERNET_IDENTITY_ID`]: icpIds.internetIdentityId
            }),
            ...(icpIds?.icpLedgerId !== undefined && {
              [`${prefix}ICP_LEDGER_ID`]: icpIds.icpLedgerId
            }),
            ...(icpIds?.icpIndexId !== undefined && {
              [`${prefix}ICP_INDEX_ID`]: icpIds.icpIndexId
            }),
            ...(icpIds?.nnsGovernanceId !== undefined && {
              [`${prefix}NNS_GOVERNANCE_ID`]: icpIds.nnsGovernanceId
            }),
            ...(icpIds?.cmcId !== undefined && {
              [`${prefix}CMC_ID`]: icpIds.cmcId
            }),
            ...(icpIds?.registryId !== undefined && {
              [`${prefix}REGISTRY_ID`]: icpIds.registryId
            }),
            ...(icpIds?.cyclesLedgerId !== undefined && {
              [`${prefix}CYCLES_LEDGER_ID`]: icpIds.cyclesLedgerId
            }),
            ...(icpIds?.cyclesIndexId !== undefined && {
              [`${prefix}CYCLES_INDEX_ID`]: icpIds.cyclesIndexId
            }),
            ...(icpIds?.snsWasmId !== undefined && {
              [`${prefix}SNS_WASM_ID`]: icpIds.snsWasmId
            }),
            ...(icpIds?.nnsDappId !== undefined && {
              [`${prefix}NNS_DAPP_ID`]: icpIds.nnsDappId
            }),
            ...(container !== undefined && {
              [`${prefix}CONTAINER`]: container
            }),
            ...(authClientIds?.google !== undefined && {
              [`${prefix}GOOGLE_CLIENT_ID`]: authClientIds.google
            })
          };

          build.initialOptions.define = {
            ...build.initialOptions.define,
            ...Object.entries(defines).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: JSON.stringify(value)
              }),
              {}
            )
          };
        } catch (err: unknown) {
          if (err instanceof JunoPluginError && mode !== 'production') {
            console.warn(err.message);
            return;
          }

          throw err;
        }
      };

      build.onStart(defineConfig);
    }
  });
