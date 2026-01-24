import type {JunoConfig} from '@junobuild/config';
import * as configLoader from '@junobuild/config-loader';
import type {MockInstance} from 'vitest';
import {
  CMC_ID,
  CYCLES_INDEX_ID,
  CYCLES_LEDGER_ID,
  DOCKER_CONTAINER_URL,
  DOCKER_SATELLITE_ID,
  ICP_INDEX_ID,
  ICP_LEDGER_ID,
  INTERNET_IDENTITY_ID,
  MODE_DEVELOPMENT,
  NNS_DAPP_ID,
  NNS_GOVERNANCE_ID,
  REGISTRY_ID,
  SNS_WASM_ID
} from '../constants';
import {initConfig} from '../init';
import type {ConfigArgs} from '../types';

vi.mock('@junobuild/config-loader', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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

  const expectedIcpIds = {
    internetIdentityId: INTERNET_IDENTITY_ID,
    icpLedgerId: ICP_LEDGER_ID,
    icpIndexId: ICP_INDEX_ID,
    nnsGovernanceId: NNS_GOVERNANCE_ID,
    cmcId: CMC_ID,
    registryId: REGISTRY_ID,
    cyclesLedgerId: CYCLES_LEDGER_ID,
    cyclesIndexId: CYCLES_INDEX_ID,
    snsWasmId: SNS_WASM_ID,
    nnsDappId: NNS_DAPP_ID
  };

  const mockGoogleClientId = '1234567890-abcdef.apps.googleusercontent.com';

  let spyJunoConfigExist: MockInstance;
  let spyReadJunoConfig: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    spyJunoConfigExist = vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
    spyReadJunoConfig = vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
      satellite: {
        ids: {production: 'mock-satellite-id'},
        authentication: {google: {clientId: mockGoogleClientId}}
      },
      orbiter: {id: 'mock-orbiter-id'}
    });
  });

  it('returns config for development', async () => {
    vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

    const result = await initConfig({
      params: {},
      mode: MODE_DEVELOPMENT
    });

    expect(result).toEqual({
      orbiterId: undefined,
      satelliteId: DOCKER_SATELLITE_ID,
      authClientIds: {google: mockGoogleClientId},
      icpIds: expectedIcpIds,
      container: DOCKER_CONTAINER_URL
    });

    expect(configLoader.junoConfigExist).toHaveResolvedTimes(4);
    expect(spyReadJunoConfig).toHaveBeenCalledTimes(4);
  });

  it('returns config without container for production', async () => {
    const result = await initConfig(args);

    expect(result).toEqual({
      satelliteId: 'mock-satellite-id',
      orbiterId: 'mock-orbiter-id',
      authClientIds: {google: mockGoogleClientId},
      icpIds: expectedIcpIds,
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
        mode: MODE_DEVELOPMENT
      });

      expect(result).toEqual({
        orbiterId: undefined,
        satelliteId: DOCKER_SATELLITE_ID,
        icpIds: expectedIcpIds,
        container: DOCKER_CONTAINER_URL
      });

      expect(configLoader.junoConfigExist).toHaveBeenCalled();
      expect(spyReadJunoConfig).not.toHaveBeenCalled();
    });

    it('returns fallback Docker satellite ID when using container and config does not exist and container is specified', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      const result = await initConfig({
        params: {container: true},
        mode: MODE_DEVELOPMENT
      });

      expect(result).toEqual({
        satelliteId: DOCKER_SATELLITE_ID,
        orbiterId: undefined,
        icpIds: expectedIcpIds,
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
      authClientIds: {google: mockGoogleClientId},
      icpIds: expectedIcpIds,
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
      mode: MODE_DEVELOPMENT
    });

    expect(result).toEqual({
      satelliteId: 'custom-docker-id',
      orbiterId: undefined,
      icpIds: expectedIcpIds,
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
        mode: MODE_DEVELOPMENT
      })
    ).rejects.toThrow(
      'Your configuration is invalid. A Satellite ID for development must be provided.'
    );
  });

  it('throws if satelliteId is missing in config in development', async () => {
    vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValueOnce({
      satellite: {}
    } as unknown as JunoConfig);

    await expect(
      initConfig({
        params: {
          container: false
        },
        mode: MODE_DEVELOPMENT
      })
    ).rejects.toThrow(
      'Your configuration is invalid. A Satellite ID for development must be provided.'
    );
  });

  it('throws if satelliteId is missing in config in production', async () => {
    vi.spyOn(configLoader, 'readJunoConfig').mockImplementation(
      // eslint-disable-next-line require-await
      async () => ({satellite: {}}) as unknown as JunoConfig
    );

    await expect(initConfig(args)).rejects.toThrow(
      'Your project needs a Satellite for production. Create one at https://console.juno.build and set its ID in your configuration file.'
    );
  });

  it('throws if readJunoConfig returns undefined', async () => {
    vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue(undefined as unknown as JunoConfig);

    await expect(initConfig(args)).rejects.toThrow('No configuration exported for production.');
  });
});
