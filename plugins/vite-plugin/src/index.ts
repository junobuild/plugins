import {ConfigArgs, JunoParams, JunoPluginError, initConfig} from '@junobuild/plugin-tools';
import {type Plugin, type UserConfig} from 'vite';

export default function Juno(params?: JunoParams): Plugin {
  return {
    name: 'vite-plugin-juno',
    async config({envPrefix}: UserConfig, {mode}: {mode: string; command: string}) {
      try {
        const args: ConfigArgs = {params, mode};

        const {satelliteId, orbiterId, icpIds, container} = await initConfig(args);

        const vitePrefix = `import.meta.env.${envPrefix ?? 'VITE_'}`;
        const processPrefix = `process.env.${envPrefix ?? 'VITE_'}`;

        const config: Record<string, string> = {
          SATELLITE_ID: JSON.stringify(satelliteId),
          ...(orbiterId !== undefined && {
            ORBITER_ID: JSON.stringify(orbiterId)
          }),
          ...(icpIds?.internetIdentityId !== undefined && {
            INTERNET_IDENTITY_ID: JSON.stringify(icpIds.internetIdentityId)
          }),
          ...(icpIds?.icpLedgerId !== undefined && {
            ICP_LEDGER_ID: JSON.stringify(icpIds.icpLedgerId)
          }),
          ...(icpIds?.icpIndexId !== undefined && {
            ICP_INDEX_ID: JSON.stringify(icpIds.icpIndexId)
          }),
          ...(container !== undefined && {
            CONTAINER: JSON.stringify(container)
          })
        };

        return {
          define: {
            // import.meta.env.
            ...Object.entries(config).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [`${vitePrefix}${key}`]: value
              }),
              {}
            ),
            // process.env.
            ...Object.entries(config).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [`${processPrefix}${key}`]: value
              }),
              {}
            )
          }
        };
      } catch (err: unknown) {
        if (err instanceof JunoPluginError && mode !== 'production') {
          console.warn(err.message);
          return {};
        }

        throw err;
      }
    }
  };
}
