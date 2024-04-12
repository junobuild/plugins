import {ConfigArgs, JunoParams, JunoPluginError, initConfig} from '@junobuild/plugin-tools';
import type {NextConfig} from 'next';

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
