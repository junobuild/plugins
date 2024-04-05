import {
  container as containerConfig,
  icpIds as icpIdsConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig
} from '@junobuild/vite-plugin/src/config';
import type {ConfigArgs} from '@junobuild/vite-plugin/src/types';
import type {NextConfig} from 'next';
import type {JunoParams} from './types';

export const withJuno = async ({
  nextConfig,
  juno: params,
  prefix: prefixParam
}: {
  nextConfig: NextConfig;
  juno?: JunoParams;
  prefix?: string;
}): Promise<NextConfig> => {
  const args: ConfigArgs = {params, mode: process.env.NODE_ENV};

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
