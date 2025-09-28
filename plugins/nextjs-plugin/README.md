[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/nextjs-plugin
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/nextjs-plugin
[npm-license]: https://img.shields.io/npm/l/@junobuild/nextjs-plugin
[npm-license-url]: https://github.com/junobuild/plugins/blob/main/LICENSE

# Juno Next.js Plugin

A Next.js plugin for [Juno].

## Getting started

The plugin automatically loads your Satellite and Orbiter IDs.

With these values, you can instantiate Juno in your code without the need to manually define environment variables.

```javascript
await Promise.all([initSatellite(), initOrbiter()]);
```

## Environment variables

Those following environment variables are injected by this plugin:

| Environment variable             | Value                                                                    |
| -------------------------------- | ------------------------------------------------------------------------ |
| NEXT_PUBLIC_SATELLITE_ID         | Satellite ID from Juno config (per `mode`)                               |
| NEXT_PUBLIC_ORBITER_ID           | `undefined` in development, Orbiter ID from Juno config.                 |
| NEXT_PUBLIC_INTERNET_IDENTITY_ID | `rdmx6-jaaaa-aaaaa-aaadq-cai`                                            |
| NEXT_PUBLIC_ICP_LEDGER_ID        | `ryjl3-tyaaa-aaaaa-aaaba-cai`                                            |
| NEXT_PUBLIC_ICP_INDEX_ID         | `qhbym-qaaaa-aaaaa-aaafq-cai`                                            |
| NEXT_PUBLIC_NNS_GOVERNANCE_ID    | `rrkah-fqaaa-aaaaa-aaaaq-cai`                                            |
| NEXT_PUBLIC_CMC_ID               | `rkp4c-7iaaa-aaaaa-aaaca-cai`                                            |
| NEXT_PUBLIC_REGISTRY_ID          | `rwlgt-iiaaa-aaaaa-aaaaa-cai`                                            |
| NEXT_PUBLIC_CYCLES_LEDGER_ID     | `um5iw-rqaaa-aaaaq-qaaba-cai`                                            |
| NEXT_PUBLIC_CYCLES_INDEX_ID      | `ul4oc-4iaaa-aaaaq-qaabq-cai`                                            |
| NEXT_PUBLIC_SNS_WASM_ID          | `qaa6y-5yaaa-aaaaa-aaafa-cai`                                            |
| NEXT_PUBLIC_NNS_DAPP_ID          | `qoctq-giaaa-aaaaa-aaaea-cai`                                            |
| NEXT_PUBLIC_CONTAINER            | Container URL (emulator or custom); `undefined` by default in production |

> Variables prefixed with `NEXT_PUBLIC_` are clearly marked for browser availability, but they are injected into the environment ([documentation](https://nextjs.org/docs/pages/api-reference/next-config-js/env)) by the plugin. If you prefer to remove or change this prefix, it is possible using the option `prefix`.

## Installation

```bash
npm i @junobuild/nextjs-plugin -D
```

## Usage

In your `next.config.mjs` file:

```javascript
import {withJuno} from '@junobuild/nextjs-plugin';

export default withJuno();
```

The plugin sets the build output to `export` by default. You can override the option or provide additional options as follows:

```javascript
import {withJuno} from '@junobuild/nextjs-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

export default withJuno({nextConfig});
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
import {withJuno} from '@junobuild/nextjs-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

export default withJuno({
  nextConfig,
  juno: {
    container: {
      url: 'http://127.0.0.1:8000',
      modes: ['development', 'test']
    }
  }
});
```

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
