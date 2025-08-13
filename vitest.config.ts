import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    passWithNoTests: true,
    globals: true,
    typecheck: {
      tsconfig: 'tsconfig.spec.json'
    }
  }
});
