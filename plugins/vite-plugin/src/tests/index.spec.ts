import * as pluginTools from '@junobuild/plugin-tools';
import type {UserConfig} from 'vite';

import Juno from '../index';

describe('vite-plugin-juno', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls initConfig and returns expected define values', async () => {
    const spyInitConfig = vi.spyOn(pluginTools, 'initConfig').mockResolvedValue({
      satelliteId: 'sat-id',
      orbiterId: 'orb-id',
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

    const plugin = Juno() as unknown as {
      config: (
        {envPrefix}: UserConfig,
        {mode}: {mode: string; command: string}
      ) => Promise<{define: Record<string, string>}>;
    };
    const result = await plugin.config({}, {mode: 'development', command: 'serve'});

    expect(spyInitConfig).toHaveBeenCalledWith({
      params: undefined,
      mode: 'development'
    });

    expect(result).toEqual({
      define: {
        'import.meta.env.VITE_SATELLITE_ID': JSON.stringify('sat-id'),
        'import.meta.env.VITE_ORBITER_ID': JSON.stringify('orb-id'),
        'import.meta.env.VITE_INTERNET_IDENTITY_ID': JSON.stringify('ii-id'),
        'import.meta.env.VITE_ICP_LEDGER_ID': JSON.stringify('ledger-id'),
        'import.meta.env.VITE_ICP_INDEX_ID': JSON.stringify('index-id'),
        'import.meta.env.VITE_NNS_GOVERNANCE_ID': JSON.stringify('nns-governance-id'),
        'import.meta.env.VITE_CMC_ID': JSON.stringify('cmc-id'),
        'import.meta.env.VITE_REGISTRY_ID': JSON.stringify('registry-id'),
        'import.meta.env.VITE_CYCLES_INDEX_ID': JSON.stringify('cycles-index-id'),
        'import.meta.env.VITE_CYCLES_LEDGER_ID': JSON.stringify('cycles-ledger-id'),
        'import.meta.env.VITE_SNS_WASM_ID': JSON.stringify('sns-wasm-id'),
        'import.meta.env.VITE_NNS_DAPP_ID': JSON.stringify('nns-dapp-id'),
        'import.meta.env.VITE_CONTAINER': JSON.stringify('http://localhost:1234')
      }
    });
  });
});
