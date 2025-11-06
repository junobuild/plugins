import {
  container as containerConfig,
  icpIds as icpIdsConfig,
  orbiterId as orbiterIdConfig,
  satelliteId as satelliteIdConfig,
  useDockerContainer
} from './config';
import {assertJunoConfig} from './fs';
import type {ConfigArgs, IcpIds} from './types';

export const initConfig = async (
  args: ConfigArgs
): Promise<{
  satelliteId: string;
  orbiterId: string | undefined;
  icpIds: IcpIds | undefined;
  container: string | undefined;
}> => {
  // We perform the checks in advance to throw the potential error only once.
  // We also assert the config file exists only if the Docker container should not be used given that the file won't be required otherwise.
  if (!useDockerContainer(args)) {
    await assertJunoConfig();
  }

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
