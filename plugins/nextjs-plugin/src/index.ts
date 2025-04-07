import {
  type ConfigArgs,
  type JunoParams,
  JunoPluginError,
  initConfig
} from '@junobuild/plugin-tools';
import type {NextConfig} from 'next';

/**
 * Enhances the Next.js configuration with Juno integration.
 * @param {Object} [params] - The parameters for the Juno integration.
 * @param {NextConfig} [params.nextConfig] - The existing Next.js configuration.
 * @param {JunoParams} [params.juno] - The Juno configuration parameters.
 * @param {string} [params.prefix='NEXT_PUBLIC_'] - The prefix for the environment variables.
 * @returns {Promise<NextConfig>} A promise that resolves to the enhanced Next.js configuration.
 * @throws {JunoPluginError} If there is an error initializing the Juno configuration in non-production mode.
 * @throws {Error} If there is an unknown error.
 */
export const withJuno = async (params?: {
  nextConfig?: NextConfig;
  juno?: JunoParams;
  prefix?: string;
}): Promise<NextConfig> => {
  const {nextConfig: nextConfigParams, juno: junoParams, prefix: prefixParam} = params ?? {};

  const nextConfig = nextConfigParams ?? {
    output: 'export'
  };

  const mode = process.env.NODE_ENV;

  try {
    const args: ConfigArgs = {params: junoParams, mode};

    const {satelliteId, orbiterId, icpIds, container} = await initConfig(args);

    const prefix = prefixParam ?? 'NEXT_PUBLIC_';

    return {
      ...(nextConfig ?? {}),
      env: {
        ...(nextConfig.env ?? {}),
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
        ...(container !== undefined && {
          [`${prefix}CONTAINER`]: container
        })
      }
    };
  } catch (err: unknown) {
    if (err instanceof JunoPluginError && mode !== 'production') {
      console.warn(err.message);
      return {
        ...(nextConfig ?? {})
      };
    }

    throw err;
  }
};
