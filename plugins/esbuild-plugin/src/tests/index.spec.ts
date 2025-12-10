import * as pluginTools from '@junobuild/plugin-tools';
import {JunoPluginError} from '@junobuild/plugin-tools';
import type {PluginBuild} from 'esbuild';
import juno, {type JunoOptions} from '../index';

describe('esbuild-plugin-juno', () => {
  let mockBuild: PluginBuild;

  let onStartCallback: (() => Promise<void>) | undefined;

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.NODE_ENV = 'development';

    onStartCallback = undefined;

    mockBuild = {
      initialOptions: {
        define: {}
      },
      onStart: vi.fn((callback) => {
        onStartCallback = callback;
      })
    } as unknown as PluginBuild;
  });

  const setupPlugin = (options?: JunoOptions) => {
    const plugin = juno(options);
    plugin.setup(mockBuild);

    if (onStartCallback === undefined) {
      throw new Error('onStartCallback must be defined');
    }

    return onStartCallback;
  };

  it('merges config and sets all define vars', async () => {
    const spy = vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: 'orb-id',
      authClientIds: {
        google: 'google-client-id-123'
      },
      icpIds: {
        internetIdentityId: 'ii-id',
        icpLedgerId: 'ledger-id',
        icpIndexId: 'index-id',
        nnsGovernanceId: 'nns-governance-id',
        cmcId: 'cmc-id',
        registryId: 'registry-id',
        cyclesLedgerId: 'cycles-ledger-id',
        cyclesIndexId: 'cycles-index-id',
        snsWasmId: 'sns-wasm-id',
        nnsDappId: 'nns-dapp-id'
      },
      container: 'http://localhost:1234'
    });

    const callback = setupPlugin();
    await callback();

    expect(spy).toHaveBeenCalledWith({
      params: undefined,
      mode: 'development'
    });

    expect(mockBuild.initialOptions.define).toEqual({
      'process.env.SATELLITE_ID': JSON.stringify('sat-id'),
      'process.env.ORBITER_ID': JSON.stringify('orb-id'),
      'process.env.INTERNET_IDENTITY_ID': JSON.stringify('ii-id'),
      'process.env.ICP_LEDGER_ID': JSON.stringify('ledger-id'),
      'process.env.ICP_INDEX_ID': JSON.stringify('index-id'),
      'process.env.NNS_GOVERNANCE_ID': JSON.stringify('nns-governance-id'),
      'process.env.CMC_ID': JSON.stringify('cmc-id'),
      'process.env.REGISTRY_ID': JSON.stringify('registry-id'),
      'process.env.CYCLES_INDEX_ID': JSON.stringify('cycles-index-id'),
      'process.env.CYCLES_LEDGER_ID': JSON.stringify('cycles-ledger-id'),
      'process.env.SNS_WASM_ID': JSON.stringify('sns-wasm-id'),
      'process.env.NNS_DAPP_ID': JSON.stringify('nns-dapp-id'),
      'process.env.CONTAINER': JSON.stringify('http://localhost:1234'),
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify('google-client-id-123')
    });
  });

  it('respects custom env prefix', async () => {
    vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: undefined,
      authClientIds: undefined,
      icpIds: undefined,
      container: undefined
    });

    const callback = setupPlugin({envPrefix: 'TEST_'});
    await callback();

    expect(mockBuild.initialOptions.define).toEqual({
      'process.env.TEST_SATELLITE_ID': JSON.stringify('sat-id')
    });
  });

  it('merges with existing define properties', async () => {
    mockBuild.initialOptions.define = {
      'process.env.FOO': JSON.stringify('bar')
    };

    vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: undefined,
      authClientIds: undefined,
      icpIds: undefined,
      container: undefined
    });

    const callback = setupPlugin();
    await callback();

    expect(mockBuild.initialOptions.define).toEqual({
      'process.env.FOO': JSON.stringify('bar'),
      'process.env.SATELLITE_ID': JSON.stringify('sat-id')
    });
  });

  it('passes emulator params to initConfig', async () => {
    const spy = vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: undefined,
      authClientIds: undefined,
      icpIds: undefined,
      container: undefined
    });

    const emulatorParams = {container: true};

    const callback = setupPlugin({emulator: emulatorParams});
    await callback();

    expect(spy).toHaveBeenCalledWith({
      params: emulatorParams,
      mode: 'development'
    });
  });

  it('logs and continues on JunoPluginError in non-production', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(pluginTools, 'initConfig').mockRejectedValue(
      new JunoPluginError('Juno config missing')
    );

    const callback = setupPlugin();
    await callback();

    expect(warn).toHaveBeenCalledWith('Juno config missing');
    expect(mockBuild.initialOptions.define).toEqual({});
  });

  it('throws JunoPluginError in production', async () => {
    process.env.NODE_ENV = 'production';

    vi.spyOn(pluginTools, 'initConfig').mockRejectedValue(
      new JunoPluginError('Juno config missing')
    );

    const callback = setupPlugin();

    await expect(callback()).rejects.toThrow('Juno config missing');
  });

  it('throws unknown errors', async () => {
    vi.spyOn(pluginTools, 'initConfig').mockRejectedValue(new Error('Boom'));

    const callback = setupPlugin();

    await expect(callback()).rejects.toThrow('Boom');
  });

  it('defaults to production mode when NODE_ENV is not set', async () => {
    delete process.env.NODE_ENV;

    const spy = vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: undefined,
      authClientIds: undefined,
      icpIds: undefined,
      container: undefined
    });

    const callback = setupPlugin();
    await callback();

    expect(spy).toHaveBeenCalledWith({
      params: undefined,
      mode: 'production'
    });
  });
});
