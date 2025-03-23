import {default as config} from '@dfinity/eslint-config-oisy-wallet';

export default [
  ...config,
  {
    ignores: ['**/dist/', 'eslint-local-rules.cjs', 'scripts/**/*', '**/esbuild.mjs']
  }
];
