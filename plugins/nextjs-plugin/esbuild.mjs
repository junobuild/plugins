#!/usr/bin/env node

import esbuild from 'esbuild';
import {existsSync, mkdirSync, readFileSync} from 'fs';
import {join} from 'path';

const dist = join(process.cwd(), 'dist');

const createDistFolder = () => {
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
};

// Skip peer dependencies
const peerDependencies = (packageJson) => {
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies} = JSON.parse(json);
  return peerDependencies ?? {};
};

const workspacePeerDependencies = peerDependencies(join(process.cwd(), 'package.json'));

const buildEsm = () => {
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.mjs',
      bundle: true,
      minify: true,
      format: 'esm',
      platform: 'node',
      banner: {
        js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
      },
      external: [...Object.keys(workspacePeerDependencies)]
    })
    .catch(() => process.exit(1));
};

export const build = () => {
  createDistFolder();
  buildEsm();
};

build();
