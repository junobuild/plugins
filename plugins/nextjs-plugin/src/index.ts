import type {ConfigArgs, JunoParams} from '@junobuild/plugin-tools';
import {
  container as containerConfig,
  icpIds as icpIdsConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig
} from '@junobuild/plugin-tools';
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

  const args: ConfigArgs = {params: junoParams, mode: process.env.NODE_ENV};

  const [satelliteId, orbiterId, icpIds, container] = await Promise.all([
    satelliteIdConfig(args),
    orbiterIdConfig(args),
    Promise.resolve(icpIdsConfig()),
    Promise.resolve(containerConfig(args))
  ]);

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
};
