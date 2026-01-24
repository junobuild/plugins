import * as pluginTools from '@junobuild/plugin-tools';
import {JunoPluginError} from '@junobuild/plugin-tools';

import {withJuno} from '../index';

describe('withJuno', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error we want to mock development env
    process.env.NODE_ENV = 'development';
  });

  it('merges config and sets all env vars', async () => {
    const spy = vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: 'orb-id',
      authClientIds: {
        google: 'google-client-id-123',
        github: 'github-client-id-123'
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

    const result = await withJuno();

    expect(spy).toHaveBeenCalledWith({
      params: undefined,
      mode: 'development'
    });

    expect(result).toEqual({
      output: 'export',
      env: {
        NEXT_PUBLIC_SATELLITE_ID: 'sat-id',
        NEXT_PUBLIC_ORBITER_ID: 'orb-id',
        NEXT_PUBLIC_INTERNET_IDENTITY_ID: 'ii-id',
        NEXT_PUBLIC_ICP_LEDGER_ID: 'ledger-id',
        NEXT_PUBLIC_ICP_INDEX_ID: 'index-id',
        NEXT_PUBLIC_NNS_GOVERNANCE_ID: 'nns-governance-id',
        NEXT_PUBLIC_CMC_ID: 'cmc-id',
        NEXT_PUBLIC_REGISTRY_ID: 'registry-id',
        NEXT_PUBLIC_CYCLES_INDEX_ID: 'cycles-index-id',
        NEXT_PUBLIC_CYCLES_LEDGER_ID: 'cycles-ledger-id',
        NEXT_PUBLIC_SNS_WASM_ID: 'sns-wasm-id',
        NEXT_PUBLIC_NNS_DAPP_ID: 'nns-dapp-id',
        NEXT_PUBLIC_CONTAINER: 'http://localhost:1234',
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'google-client-id-123',
        NEXT_PUBLIC_GITHUB_CLIENT_ID: 'github-client-id-123'
      }
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

    const result = await withJuno({prefix: 'TEST_'});

    expect(result.env?.TEST_SATELLITE_ID).toBe('sat-id');
    expect(result.env?.NEXT_PUBLIC_SATELLITE_ID).toBeUndefined();
  });

  it('merges with existing nextConfig and set output export', async () => {
    vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: undefined,
      authClientIds: undefined,
      icpIds: undefined,
      container: undefined
    });

    const result = await withJuno({
      nextConfig: {
        env: {
          FOO: 'bar'
        }
      }
    });

    expect(result).toEqual({
      output: 'export',
      env: {
        FOO: 'bar',
        NEXT_PUBLIC_SATELLITE_ID: 'sat-id'
      }
    });
  });

  it('logs and returns base config on JunoPluginError in non-production', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(pluginTools, 'initConfig').mockRejectedValue(
      new JunoPluginError('Juno config missing')
    );

    const result = await withJuno();

    expect(warn).toHaveBeenCalledWith('Juno config missing');
    expect(result).toEqual({output: 'export'});
  });

  it('throws unknown errors', async () => {
    vi.spyOn(pluginTools, 'initConfig').mockRejectedValue(new Error('Boom'));

    await expect(() => withJuno()).rejects.toThrow('Boom');
  });
});
