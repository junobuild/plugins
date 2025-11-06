import {
  type ConfigArgs,
  type JunoParams,
  JunoPluginError,
  initConfig
} from '@junobuild/plugin-tools';
import type {NextConfig} from 'next';

const REQUIRED_NEXT_CONFIG: Required<Pick<NextConfig, 'output'>> = {
  output: 'export'
};

/**
 * Applies Juno configuration to a Next.js project by wrapping the existing Next.js config.
 *
 * This function:
 * - Loads values from the `juno.config` file.
 * - Injects them into the `env` field of the returned Next.js configuration.
 * - Ensures the `output` field is always set to `"export"` for static site generation.
 *
 * If the `juno.config` cannot be loaded and the environment is not production,
 * the error is logged and the original config is returned (with `output: "export"`).
 *
 * @param params - Optional parameters for configuring the plugin.
 * @param params.nextConfig - Partial Next.js configuration (excluding `output`, which is enforced).
 * @param params.juno - Optional overrides for loading `juno.config`.
 * @param params.prefix - The prefix used for injected environment variables. Defaults to `'NEXT_PUBLIC_'`.
 *
 * @returns A Promise that resolves to a complete `NextConfig` object with Juno configuration applied.
 *
 * @throws {JunoPluginError} If `juno.config` fails to load in production mode.
 * @throws {Error} For all other unexpected errors.
 */
export const withJuno = async (params?: {
  nextConfig?: Omit<NextConfig, 'output'>;
  juno?: JunoParams;
  prefix?: string;
}): Promise<NextConfig> => {
  const {nextConfig, juno: junoParams, prefix: prefixParam} = params ?? {};

  const mode = process.env.NODE_ENV;

  try {
    const args: ConfigArgs = {params: junoParams, mode};

    const {satelliteId, orbiterId, icpIds, container, authClientIds} = await initConfig(args);

    const prefix = prefixParam ?? 'NEXT_PUBLIC_';

    return {
      ...(nextConfig ?? {}),
      env: {
        ...(nextConfig?.env ?? {}),
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
      },
      ...REQUIRED_NEXT_CONFIG
    };
  } catch (err: unknown) {
    if (err instanceof JunoPluginError && mode !== 'production') {
      console.warn(err.message);
      return {
        ...(nextConfig ?? {}),
        ...REQUIRED_NEXT_CONFIG
      };
    }

    throw err;
  }
};
