import {JunoConfig} from '@junobuild/config';
import * as configLoader from '@junobuild/config-loader';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  assertJunoConfig,
  container,
  icpIds,
  orbiterId,
  satelliteId,
  useDockerContainer
} from './config';
import {
  DOCKER_SATELLITE_ID,
  ICP_INDEX_ID,
  ICP_LEDGER_ID,
  INTERNET_IDENTITY_ID,
  MODE_DEVELOPMENT
} from './constants';
import {JunoPluginError} from './error';

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

describe('config', () => {
  describe('useDockerContainer', () => {
    it('returns true if container is true and mode is development', () => {
      expect(useDockerContainer({params: {container: true}, mode: MODE_DEVELOPMENT})).toBe(true);
    });

    it('returns false if container is false', () => {
      expect(useDockerContainer({params: {container: false}, mode: MODE_DEVELOPMENT})).toBe(false);
    });

    it('returns false in production mode', () => {
      expect(useDockerContainer({params: {container: true}, mode: 'production'})).toBe(false);
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
      ).toBe(true);
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
      ).toBe(false);
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
      ).toBe(true);
    });

    it('returns true if container is undefined and mode is development', () => {
      expect(useDockerContainer({params: {}, mode: MODE_DEVELOPMENT})).toBe(true);
    });

    it('returns false if container is undefined and mode is production', () => {
      expect(useDockerContainer({params: {}, mode: 'production'})).toBe(false);
    });

    it('returns true if params is undefined and mode is development', () => {
      expect(useDockerContainer({params: undefined, mode: MODE_DEVELOPMENT})).toBe(true);
    });

    it('returns false if params is undefined and mode is production', () => {
      expect(useDockerContainer({params: undefined, mode: 'production'})).toBe(false);
    });

    it('returns true if container is an empty object and mode is development', () => {
      expect(useDockerContainer({params: {container: {}}, mode: MODE_DEVELOPMENT})).toBe(true);
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
      ).toBe(false);
    });
  });

  describe('satelliteId', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe(MODE_DEVELOPMENT, () => {
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
    });
  });

  describe('orbiterId', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns undefined if using docker', async () => {
      const id = await orbiterId({params: {container: true}, mode: MODE_DEVELOPMENT});
      expect(id).toBeUndefined();
    });

    it('returns orbiter ID from config', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue({
        orbiter: {id: 'orb-id'}
      } as unknown as JunoConfig);

      const id = await orbiterId({params: {}, mode: 'production'});
      expect(id).toBe('orb-id');
    });
  });

  describe('icpIds', () => {
    it('returns static ICP IDs', () => {
      expect(icpIds()).toEqual({
        internetIdentityId: INTERNET_IDENTITY_ID,
        icpLedgerId: ICP_LEDGER_ID,
        icpIndexId: ICP_INDEX_ID
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

  describe('assertJunoConfig', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('throws if config does not exist', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);
      await expect(assertJunoConfig()).rejects.toThrow(JunoPluginError);
    });

    it('resolves if config exists', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);
      await expect(assertJunoConfig()).resolves.toBeUndefined();
    });
  });
});
