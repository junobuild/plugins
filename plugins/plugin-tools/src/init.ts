import {
  assertJunoConfig,
  container as containerConfig,
  icpIds as icpIdsConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig
} from './config';
import {ConfigArgs, IcpIds} from './types';

export const initConfig = async (
  args: ConfigArgs
): Promise<{
  satelliteId: string;
  orbiterId: string | undefined;
  icpIds: IcpIds | undefined;
  container: string | undefined;
}> => {
  await assertJunoConfig();

  const [satelliteId, orbiterId, icpIds, container] = await Promise.all([
    satelliteIdConfig(args),
    orbiterIdConfig(args),
    Promise.resolve(icpIdsConfig()),
    Promise.resolve(containerConfig(args))
  ]);

  return {
    satelliteId,
    orbiterId,
    icpIds,
    container
  };
};
