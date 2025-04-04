import type {JunoConfig} from '@junobuild/config';
import * as configLoader from '@junobuild/config-loader';
import {beforeEach, describe, expect, it, MockInstance, vi} from 'vitest';
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
    const result = await initConfig({
      params: {},
      mode: 'development'
    });

    expect(result).toEqual({
      orbiterId: undefined,
      satelliteId: 'jx5yt-yyaaa-aaaal-abzbq-cai',
      icpIds: {
        internetIdentityId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        icpLedgerId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icpIndexId: 'qhbym-qaaaa-aaaaa-aaafq-cai'
      },
      container: 'http://127.0.0.1:5987'
    });

    expect(spyJunoConfigExist).not.toHaveBeenCalled();
    expect(spyReadJunoConfig).not.toHaveBeenCalled();
  });

  it('returns config without container for production', async () => {
    const result = await initConfig(args);

    expect(result).toEqual({
      satelliteId: 'mock-satellite-id',
      orbiterId: 'mock-orbiter-id',
      icpIds: {
        internetIdentityId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        icpLedgerId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icpIndexId: 'qhbym-qaaaa-aaaaa-aaafq-cai'
      },
      container: undefined
    });

    expect(spyJunoConfigExist).toHaveBeenCalled();
    expect(spyReadJunoConfig).toHaveBeenCalled();
  });

  it('returns config for development when params is not passed', async () => {
    const result = await initConfig({
      mode: 'development'
    });

    expect(result).toEqual({
      satelliteId: 'jx5yt-yyaaa-aaaal-abzbq-cai',
      orbiterId: undefined,
      icpIds: {
        internetIdentityId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        icpLedgerId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icpIndexId: 'qhbym-qaaaa-aaaaa-aaafq-cai'
      },
      container: 'http://127.0.0.1:5987'
    });

    expect(spyJunoConfigExist).not.toHaveBeenCalled();
    expect(spyReadJunoConfig).not.toHaveBeenCalled();
  });

  it('returns config for production when params is not passed', async () => {
    const result = await initConfig({
      mode: 'production'
    });

    expect(result).toEqual({
      satelliteId: 'mock-satellite-id',
      orbiterId: 'mock-orbiter-id',
      icpIds: {
        internetIdentityId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        icpLedgerId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icpIndexId: 'qhbym-qaaaa-aaaaa-aaafq-cai'
      },
      container: undefined
    });

    expect(spyJunoConfigExist).toHaveBeenCalled();
    expect(spyReadJunoConfig).toHaveBeenCalled();
  });

  it('skips assertJunoConfig when using Docker container', async () => {
    const dockerArgs: ConfigArgs = {
      params: {container: true},
      mode: 'development'
    };

    const result = await initConfig(dockerArgs);

    expect(result).toEqual({
      satelliteId: 'jx5yt-yyaaa-aaaal-abzbq-cai', // fallback to docker const
      orbiterId: undefined,
      icpIds: {
        internetIdentityId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        icpLedgerId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
        icpIndexId: 'qhbym-qaaaa-aaaaa-aaafq-cai'
      },
      container: 'http://127.0.0.1:5987'
    });

    expect(spyJunoConfigExist).not.toHaveBeenCalled();
    expect(spyReadJunoConfig).not.toHaveBeenCalled();
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
