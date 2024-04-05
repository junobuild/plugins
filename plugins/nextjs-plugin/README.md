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
await Promise.all([
  initJuno({
    satelliteId: process.env.NEXT_PUBLIC_SATELLITE_ID
  }),
  initOrbiter({
    satelliteId: process.env.NEXT_PUBLIC_SATELLITE_ID,
    orbiterId: process.env.NEXT_PUBLIC_ORBITER_ID
  })
]);
```

## Environment variables

Those following environment variables are injected by this plugin:

| Environment variable             | Value in mode `development`   | Value for other modes                                              |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| NEXT_PUBLIC_SATELLITE_ID         | `jx5yt-yyaaa-aaaal-abzbq-cai` | The Satellite ID for the `mode` from your Juno configuration file. |
| NEXT_PUBLIC_ORBITER_ID           | `undefined`                   | The Orbiter ID from your Juno configuration file.                  |
| NEXT_PUBLIC_INTERNET_IDENTITY_ID | `rdmx6-jaaaa-aaaaa-aaadq-cai` | `rdmx6-jaaaa-aaaaa-aaadq-cai`                                      |
| NEXT_PUBLIC_ICP_LEDGER_ID        | `ryjl3-tyaaa-aaaaa-aaaba-cai` | `ryjl3-tyaaa-aaaaa-aaaba-cai`                                      |
| NEXT_PUBLIC_ICP_INDEX_ID         | `qhbym-qaaaa-aaaaa-aaafq-cai` | `qhbym-qaaaa-aaaaa-aaafq-cai`                                      |

> Variables prefixed with NEXT*PUBLIC* are clearly marked for browser availability, but they are injected into the environment ([documentation](https://nextjs.org/docs/pages/api-reference/next-config-js/env)) by the plugin. If you prefer to remove or change this prefix, it is possible.

## Installation

```bash
npm i @junobuild/nextjs-plugin -D
```

## Usage

```javascript
import {withJuno} from '@junobuild/nextjs-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

export default withJuno({nextConfig});
```

## Options

The plugins can be initialized with the following options:

- `container`: `true` to use [Juno Docker](https://github.com/junobuild/juno-docker) with default options, or specify an object.

The object accepts the following parameters:

- An optional `url` as `string`, representing the container URL including the port, e.g. `http://127.0.0.1:8000`.
- An optional list of `modes` for which the container should be used.

By default, the container is mounted only in `development` mode.

```javascript
import {withJuno} from '@junobuild/nextjs-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

export default withJuno({nextConfig, juno: {container: true}});
```

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
