import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  // [...]
  // Use the correct preset for TypeScript with Jest
  preset: 'ts-jest',
  testEnvironment: 'node',
  // The transform property is commented out, if you need a custom transformer, uncomment and update the path
  // transform: '<rootDir>/fileTransformer.js',
  
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^src/(.*)": "<rootDir>/src/$1",
  }
}

export default jestConfig;
