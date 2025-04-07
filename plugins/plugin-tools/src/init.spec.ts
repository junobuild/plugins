import type {JunoConfig} from '@junobuild/config';
import * as configLoader from '@junobuild/config-loader';
import {beforeEach, describe, expect, it, MockInstance, vi} from 'vitest';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_SATELLITE_ID,
  ICP_INDEX_ID,
  ICP_LEDGER_ID,
  INTERNET_IDENTITY_ID
} from './constants';
import {initConfig} from './init';
import type {ConfigArgs} from './types';

vi.mock('@junobuild/config-loader', async () => {
  const actual = await vi.importActual<typeof import('@junobuild/config-loader')>(
    '@junobuild/config-loader'
  );

  return {
    ...actual,
    junoConfigExist: vi.fn(),
    readJunoConfig: vi.fn()
  };
});

describe('init', () => {
  const args: ConfigArgs = {
    params: {},
    mode: 'production'
  };

  let spyJunoConfigExist: MockInstance;
  let spyReadJunoConfig: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    spyJunoConfigExist = vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
    spyReadJunoConfig = vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
      satellite: {ids: {production: 'mock-satellite-id'}},
      orbiter: {id: 'mock-orbiter-id'}
    });
  });

  it('returns config for development', async () => {
    vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

    const result = await initConfig({
      params: {},
      mode: 'development'
    });

    expect(result).toEqual({
      orbiterId: undefined,
      satelliteId: DOCKER_SATELLITE_ID,
      icpIds: {
        internetIdentityId: INTERNET_IDENTITY_ID,
        icpLedgerId: ICP_LEDGER_ID,
        icpIndexId: ICP_INDEX_ID
      },
      container: DOCKER_CONTAINER_URL
    });

    expect(configLoader.junoConfigExist).toHaveBeenCalled();
    expect(spyReadJunoConfig).not.toHaveBeenCalled();
  });

  it('returns config without container for production', async () => {
    const result = await initConfig(args);

    expect(result).toEqual({
      satelliteId: 'mock-satellite-id',
      orbiterId: 'mock-orbiter-id',
      icpIds: {
        internetIdentityId: INTERNET_IDENTITY_ID,
        icpLedgerId: ICP_LEDGER_ID,
        icpIndexId: ICP_INDEX_ID
      },
      container: undefined
    });

    expect(spyJunoConfigExist).toHaveBeenCalled();
    expect(spyReadJunoConfig).toHaveBeenCalled();
  });

  describe('no config', () => {
    it('returns default docker satellite ID in development if config does not exist', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      const result = await initConfig({
        params: {},
        mode: 'development'
      });

      expect(result).toEqual({
        orbiterId: undefined,
        satelliteId: DOCKER_SATELLITE_ID,
        icpIds: {
          internetIdentityId: INTERNET_IDENTITY_ID,
          icpLedgerId: ICP_LEDGER_ID,
          icpIndexId: ICP_INDEX_ID
        },
        container: DOCKER_CONTAINER_URL
      });

      expect(configLoader.junoConfigExist).toHaveBeenCalled();
      expect(spyReadJunoConfig).not.toHaveBeenCalled();
    });

    it('returns fallback Docker satellite ID when using container and config does not exist and container is specified', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      const result = await initConfig({
        params: {container: true},
        mode: 'development'
      });

      expect(result).toEqual({
        satelliteId: DOCKER_SATELLITE_ID,
        orbiterId: undefined,
        icpIds: {
          internetIdentityId: INTERNET_IDENTITY_ID,
          icpLedgerId: ICP_LEDGER_ID,
          icpIndexId: ICP_INDEX_ID
        },
        container: DOCKER_CONTAINER_URL
      });

      expect(configLoader.junoConfigExist).toHaveBeenCalled();
      expect(spyReadJunoConfig).not.toHaveBeenCalled();
    });
  });

  it('returns config for production when params is not passed', async () => {
    const result = await initConfig({
      mode: 'production'
    });

    expect(result).toEqual({
      satelliteId: 'mock-satellite-id',
      orbiterId: 'mock-orbiter-id',
      icpIds: {
        internetIdentityId: INTERNET_IDENTITY_ID,
        icpLedgerId: ICP_LEDGER_ID,
        icpIndexId: ICP_INDEX_ID
      },
      container: undefined
    });

    expect(spyJunoConfigExist).toHaveBeenCalled();
    expect(spyReadJunoConfig).toHaveBeenCalled();
  });

  it('returns satellite ID from config when using container and config exists', async () => {
    vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
    vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
      satellite: {ids: {development: 'custom-docker-id'}}
    });

    const result = await initConfig({
      params: {container: true},
      mode: 'development'
    });

    expect(result).toEqual({
      satelliteId: 'custom-docker-id',
      orbiterId: undefined,
      icpIds: {
        internetIdentityId: INTERNET_IDENTITY_ID,
        icpLedgerId: ICP_LEDGER_ID,
        icpIndexId: ICP_INDEX_ID
      },
      container: DOCKER_CONTAINER_URL
    });

    expect(configLoader.junoConfigExist).toHaveBeenCalled();
    expect(configLoader.readJunoConfig).toHaveBeenCalled();
  });

  it('throws if config does not exist and mode is production', async () => {
    vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

    await expect(initConfig(args)).rejects.toThrow(/No Juno configuration found/);
  });

  it('throws if satelliteId is missing in config if container is set to false', async () => {
    vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValueOnce({
      satellite: {}
    } as unknown as JunoConfig);

    await expect(
      initConfig({
        params: {
          container: false
        },
        mode: 'development'
      })
    ).rejects.toThrow(/A satellite ID for development must be set/);
  });

  it('throws if satelliteId is missing in config', async () => {
    vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValueOnce({
      satellite: {}
    } as unknown as JunoConfig);

    await expect(initConfig(args)).rejects.toThrow(
      /Your configuration is invalid. A satellite ID for production must be set in your configuration file./
    );
  });
});
