[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/vite-plugin
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/vite-plugin
[npm-license]: https://img.shields.io/npm/l/@junobuild/vite-plugin
[npm-license-url]: https://github.com/junobuild/plugins/blob/main/LICENSE

# Juno Vite Plugin

A Vite plugin for [Juno].

## Environment variables

The plugin automatically loads the Satellite ID from your project's `juno.json`. If you are using analytics, it also loads the Orbiter ID.

With these values, you can instantiate Juno in your code without the need to manually define environment variables.

```javascript
await Promise.all([
  initJuno({
    satelliteId: import.meta.env.VITE_SATELLITE_ID
  }),
  initOrbiter({
    satelliteId: import.meta.env.VITE_SATELLITE_ID,
    orbiterId: import.meta.env.VITE_ORBITER_ID
  })
]);
```

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

The plugins can be initialized with the following options:

- `junolator`: If set to `true`, the satellite ID will resolve to the locally deployed satellite if the mode is set to development.

```javascript
// vite.config.js
import juno from '@junobuild/vite-plugin';

export default defineConfig({
  plugins: [
    juno({
      junolator: true
    })
  ]
});
```

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
