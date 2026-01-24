import type {JunoConfig} from '@junobuild/config';
import * as configLoader from '@junobuild/config-loader';

import {
  authClientIds,
  container,
  icpIds,
  orbiterId,
  satelliteId,
  useDockerContainer
} from '../config';
import {
  CMC_ID,
  CYCLES_INDEX_ID,
  CYCLES_LEDGER_ID,
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
import {JunoPluginError} from '../error';

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

describe('config', () => {
  describe('useDockerContainer', () => {
    it('returns true if container is true and mode is development', () => {
      expect(useDockerContainer({params: {container: true}, mode: MODE_DEVELOPMENT})).toBeTruthy();
    });

    it('returns false if container is false', () => {
      expect(useDockerContainer({params: {container: false}, mode: MODE_DEVELOPMENT})).toBeFalsy();
    });

    it('returns false in production mode', () => {
      expect(useDockerContainer({params: {container: true}, mode: 'production'})).toBeFalsy();
    });

    it('returns true if container has matching mode in modes[]', () => {
      expect(
        useDockerContainer({
          params: {
            container: {
              modes: [MODE_DEVELOPMENT, 'test']
            }
          },
          mode: MODE_DEVELOPMENT
        })
      ).toBeTruthy();
    });

    it('returns false if container has non-matching mode in modes[]', () => {
      expect(
        useDockerContainer({
          params: {
            container: {
              modes: ['test']
            }
          },
          mode: 'production'
        })
      ).toBeFalsy();
    });

    it('returns true if container has no modes[] (default to development)', () => {
      expect(
        useDockerContainer({
          params: {
            container: {
              url: 'http://custom'
            }
          },
          mode: MODE_DEVELOPMENT
        })
      ).toBeTruthy();
    });

    it('returns true if container is undefined and mode is development', () => {
      expect(useDockerContainer({params: {}, mode: MODE_DEVELOPMENT})).toBeTruthy();
    });

    it('returns false if container is undefined and mode is production', () => {
      expect(useDockerContainer({params: {}, mode: 'production'})).toBeFalsy();
    });

    it('returns true if params is undefined and mode is development', () => {
      expect(useDockerContainer({params: undefined, mode: MODE_DEVELOPMENT})).toBeTruthy();
    });

    it('returns false if params is undefined and mode is production', () => {
      expect(useDockerContainer({params: undefined, mode: 'production'})).toBeFalsy();
    });

    it('returns true if container is an empty object and mode is development', () => {
      expect(useDockerContainer({params: {container: {}}, mode: MODE_DEVELOPMENT})).toBeTruthy();
    });

    it('returns false if container has empty modes[]', () => {
      expect(
        useDockerContainer({
          params: {
            container: {
              modes: []
            }
          },
          mode: MODE_DEVELOPMENT
        })
      ).toBeFalsy();
    });
  });

  describe('satelliteId', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe(`${MODE_DEVELOPMENT}`, () => {
      it('returns docker satellite ID in dev mode with container true and no config file', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

        const id = await satelliteId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBe(DOCKER_SATELLITE_ID);
      });

      it('returns satellite ID from config if it exists', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          satellite: {ids: {development: 'dev-custom-id'}}
        });

        const id = await satelliteId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBe('dev-custom-id');
      });

      it('falls back to default docker satellite ID if config exists but development ID is not set', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          satellite: {ids: {}}
        });

        const id = await satelliteId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBe(DOCKER_SATELLITE_ID);
      });

      it('falls back to default docker satellite ID if config exists but no ids', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          satellite: {id: 'prod-id'}
        });

        const id = await satelliteId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBe(DOCKER_SATELLITE_ID);
      });
    });

    describe('no container', () => {
      it('reads config if not using docker', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          satellite: {ids: {production: 'prod-sat-id'}}
        });

        const id = await satelliteId({params: {container: false}, mode: 'production'});

        expect(id).toBe('prod-sat-id');
      });

      it('throws if satellite ID is missing', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          satellite: {}
        } as unknown as JunoConfig);

        await expect(() => satelliteId({params: {}, mode: 'production'})).rejects.toThrow(
          JunoPluginError
        );
      });

      it('throws if config is undefined in satelliteId', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue(
          undefined as unknown as JunoConfig
        );

        await expect(() => satelliteId({params: {}, mode: 'production'})).rejects.toThrow(
          /No configuration exported/
        );
      });
    });
  });

  describe('orbiterId', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe(`${MODE_DEVELOPMENT}`, () => {
      it('returns undefined in dev mode with container true and no config file', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

        const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBeUndefined();
      });

      it('returns orbiter ID from config if it exists', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {ids: {development: 'orb-dev-id'}}
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBe('orb-dev-id');
      });

      it('returns undefined if config exists but development ID is not set', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {ids: {}}
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBeUndefined();
      });

      it('returns undefined if config exists but only ID is set', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {id: 'orb-id'}
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBeUndefined();
      });

      it('returns undefined if config exists but no ids', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {}
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});

        expect(id).toBeUndefined();
      });
    });

    describe('no container', () => {
      it('returns orbiter ID from orbiter.ids[mode] if set', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {
            ids: {
              production: 'orb-prod-id'
            }
          }
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: false}, mode: 'production'});

        expect(id).toBe('orb-prod-id');
      });

      it('reads config and returns orbiter ID', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
          orbiter: {id: 'orb-id'}
        } as unknown as JunoConfig);

        const id = await orbiterId({params: {container: false}, mode: 'production'});

        expect(id).toBe('orb-id');
      });

      it('returns undefined if config has no orbiter key', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({} as unknown as JunoConfig);

        const id = await orbiterId({params: {}, mode: 'production'});

        expect(id).toBeUndefined();
      });

      it('returns undefined if config is undefined', async () => {
        vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
        vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue(
          undefined as unknown as JunoConfig
        );

        const id = await orbiterId({params: {}, mode: 'production'});

        expect(id).toBeUndefined();
      });
    });
  });

  describe('icpIds', () => {
    it('returns static ICP IDs', () => {
      expect(icpIds()).toEqual({
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
      });
    });
  });

  describe('container', () => {
    it('returns default container URL if container is true', () => {
      expect(container({params: {container: true}, mode: MODE_DEVELOPMENT})).toBe(
        'http://127.0.0.1:5987'
      );
    });

    it('returns custom container URL if set', () => {
      expect(
        container({
          params: {container: {url: 'http://custom-url'}},
          mode: MODE_DEVELOPMENT
        })
      ).toBe('http://custom-url');
    });

    it('returns undefined if not using docker', () => {
      expect(container({params: {container: false}, mode: MODE_DEVELOPMENT})).toBeUndefined();
    });

    it('returns default URL if container is true', () => {
      const url = container({params: {container: true}, mode: MODE_DEVELOPMENT});

      expect(url).toBe('http://127.0.0.1:5987');
    });

    it('returns undefined in production when container is true', () => {
      const url = container({params: {container: true}, mode: 'production'});

      expect(url).toBeUndefined();
    });

    it('returns custom URL from container object', () => {
      const url = container({
        params: {
          container: {
            url: 'http://custom-container.local'
          }
        },
        mode: MODE_DEVELOPMENT
      });

      expect(url).toBe('http://custom-container.local');
    });

    it('falls back to default URL if container object has no url field', () => {
      const url = container({
        params: {
          container: {
            modes: [MODE_DEVELOPMENT]
          }
        },
        mode: MODE_DEVELOPMENT
      });

      expect(url).toBe('http://127.0.0.1:5987');
    });

    it('returns undefined if container is false', () => {
      const url = container({
        params: {
          container: false
        },
        mode: MODE_DEVELOPMENT
      });

      expect(url).toBeUndefined();
    });
  });

  describe('authClientIds', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns undefined if no config file exists', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns undefined if config is undefined', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue(
        undefined as unknown as JunoConfig
      );

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns undefined if config has no satellite key', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({} as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns undefined if satellite.authentication is undefined', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {}
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns undefined if authentication empty object', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {authentication: {}}
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns undefined if authentication when google and github are undefined', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {authentication: {github: undefined, google: undefined}}
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: MODE_DEVELOPMENT});

      expect(ids).toBeUndefined();
    });

    it('returns google clientId when set', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {
          authentication: {
            google: {clientId: 'google-client-id-123'}
          }
        }
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: 'production'});

      expect(ids).toEqual({google: 'google-client-id-123'});
    });

    it('returns github clientId when set', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {
          authentication: {
            github: {clientId: 'github-client-id-123'}
          }
        }
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: 'production'});

      expect(ids).toEqual({github: 'github-client-id-123'});
    });

    it('returns google and github clientIds when set', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        satellite: {
          authentication: {
            google: {clientId: 'google-client-id-123'},
            github: {clientId: 'github-client-id-123'}
          }
        }
      } as unknown as JunoConfig);

      const ids = await authClientIds({params: {}, mode: 'production'});

      expect(ids).toEqual({google: 'google-client-id-123', github: 'github-client-id-123'});
    });
  });
});
