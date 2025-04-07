[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/vite-plugin
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/vite-plugin
[npm-license]: https://img.shields.io/npm/l/@junobuild/vite-plugin
[npm-license-url]: https://github.com/junobuild/plugins/blob/main/LICENSE

# Juno Vite Plugin

A Vite plugin for [Juno].

## Getting started

The plugin automatically loads your Satellite and Orbiter IDs.

With these values, you can instantiate Juno in your code without the need to manually define environment variables.

```javascript
await Promise.all([initSatellite(), initOrbiter()]);
```

## Environment variables

Those following environment variables are injected by this plugin:

| Environment variable      | Value in mode `development`   | Value for other modes                                              |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| VITE_SATELLITE_ID         | `jx5yt-yyaaa-aaaal-abzbq-cai` | The Satellite ID for the `mode` from your Juno configuration file. |
| VITE_ORBITER_ID           | `undefined`                   | The Orbiter ID from your Juno configuration file.                  |
| VITE_INTERNET_IDENTITY_ID | `rdmx6-jaaaa-aaaaa-aaadq-cai` | `rdmx6-jaaaa-aaaaa-aaadq-cai`                                      |
| VITE_ICP_LEDGER_ID        | `ryjl3-tyaaa-aaaaa-aaaba-cai` | `ryjl3-tyaaa-aaaaa-aaaba-cai`                                      |
| VITE_ICP_INDEX_ID         | `qhbym-qaaaa-aaaaa-aaafq-cai` | `qhbym-qaaaa-aaaaa-aaafq-cai`                                      |
| VITE_NNS_GOVERNANCE_ID    | `rrkah-fqaaa-aaaaa-aaaaq-cai` | `rrkah-fqaaa-aaaaa-aaaaq-cai`                                      |
| VITE_CMC_ID               | `rkp4c-7iaaa-aaaaa-aaaca-cai` | `rkp4c-7iaaa-aaaaa-aaaca-cai`                                      |

> `VITE_` is the default prefix used by Vite. It can be customized as described in Vite's [documentation](https://vitejs.dev/guide/env-and-mode).

## Installation

```bash
npm i @junobuild/vite-plugin -D
```

## Usage

```javascript
// vite.config.js
import juno from '@junobuild/vite-plugin';

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
import juno from '@junobuild/vite-plugin';

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
