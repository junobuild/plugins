[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/esbuild-plugin
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/esbuild-plugin
[npm-license]: https://img.shields.io/npm/l/@junobuild/esbuild-plugin
[npm-license-url]: https://github.com/junobuild/plugins/blob/main/LICENSE

# Juno Esbuild Plugin

An esbuild plugin for [Juno].

## Getting started

The plugin automatically loads your Satellite and Orbiter IDs.

With these values, you can instantiate Juno in your code without the need to manually define environment variables.

```javascript
await Promise.all([initSatellite(), initOrbiter()]);
```

## Environment variables

Those following environment variables are injected by this plugin:

| Environment variable      | Value                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| VITE_SATELLITE_ID         | Satellite ID from Juno config (per `mode`)                               |
| VITE_ORBITER_ID           | `undefined` in development, Orbiter ID from Juno config.                 |
| VITE_INTERNET_IDENTITY_ID | `rdmx6-jaaaa-aaaaa-aaadq-cai`                                            |
| VITE_ICP_LEDGER_ID        | `ryjl3-tyaaa-aaaaa-aaaba-cai`                                            |
| VITE_ICP_INDEX_ID         | `qhbym-qaaaa-aaaaa-aaafq-cai`                                            |
| VITE_NNS_GOVERNANCE_ID    | `rrkah-fqaaa-aaaaa-aaaaq-cai`                                            |
| VITE_CMC_ID               | `rkp4c-7iaaa-aaaaa-aaaca-cai`                                            |
| VITE_REGISTRY_ID          | `rwlgt-iiaaa-aaaaa-aaaaa-cai`                                            |
| VITE_CYCLES_LEDGER_ID     | `um5iw-rqaaa-aaaaq-qaaba-cai`                                            |
| VITE_CYCLES_INDEX_ID      | `ul4oc-4iaaa-aaaaq-qaabq-cai`                                            |
| VITE_SNS_WASM_ID          | `qaa6y-5yaaa-aaaaa-aaafa-cai`                                            |
| VITE_NNS_DAPP_ID          | `qoctq-giaaa-aaaaa-aaaea-cai`                                            |
| VITE_CONTAINER            | Container URL (emulator or custom); `undefined` by default in production |

> `VITE_` is the default prefix used by Vite. It can be customized as described in Vite's [documentation](https://vitejs.dev/guide/env-and-mode).

## Installation

```bash
npm i @junobuild/esbuild-plugin -D
```

## Usage

```javascript
// vite.config.js
import juno from '@junobuild/esbuild-plugin';

export default defineConfig({
  plugins: [juno()]
});
```

## Options

The plugin can be customized using the optional `juno` configuration object. This allows you to control how the Juno Docker container is used in your project, especially during local development or end-to-end (E2E) testing.

### `juno.container`

Use the container option to enable, disable, or fine-tune the use of [Juno Docker](https://github.com/junobuild/juno-docker).

You can provide:

- `false` — to disable the container entirely.
- `true` — to enable the container with default settings (only in development mode), which is also the default behavior.
- An object with the following fields:
  - `url` (`string`, optional): A custom container URL, including the port. Example: http://127.0.0.1:8000
  - `modes` (`string[]`, optional): An array of modes (e.g., ['development', 'test']) during which the container should be used.

By default, the container is mounted only in `development` mode.

```javascript
// vite.config.js
import juno from '@junobuild/esbuild-plugin';

export default defineConfig({
  plugins: [
    juno({
      container: {
        url: 'http://127.0.0.1:8000',
        modes: ['development', 'test']
      }
    })
  ]
});
```

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
