import * as configLoader from '@junobuild/config-loader';
import {JunoPluginError} from '../error';
import {assertJunoConfig, junoConfigExist, readJunoConfig} from '../fs';

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

describe('fs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  describe('readJunoConfig', () => {
    it('throws if config does not exist', async () => {
      vi.spyOn(configLoader, 'readJunoConfig').mockRejectedValueOnce(new Error());

      await expect(assertJunoConfig()).rejects.toThrow();
    });

    it('resolves if config exists', async () => {
      const mockConfig = {
        satellite: {ids: {development: 'dev-custom-id'}}
      };

      vi.spyOn(configLoader, 'readJunoConfig').mockResolvedValue(mockConfig);

      const result = await readJunoConfig({mode: 'development'});

      expect(result).toEqual(mockConfig);
    });
  });

  describe('assertJunoConfig', () => {
    it('throws if config does not exist', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      await expect(assertJunoConfig()).rejects.toThrow(JunoPluginError);
    });

    it('resolves if config exists', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

      await expect(assertJunoConfig()).resolves.toBeUndefined();
    });
  });

  describe('junoConfigExist', () => {
    it('resolves false if config not exist', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(false);

      await expect(junoConfigExist()).resolves.toBeFalsy();
    });

    it('resolves true if config exists', async () => {
      vi.spyOn(configLoader, 'junoConfigExist').mockResolvedValue(true);

      await expect(junoConfigExist()).resolves.toBeTruthy();
    });
  });
});
