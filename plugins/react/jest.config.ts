import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  // [...]
  // Use the correct preset for TypeScript with Jest
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    nodeOptions: {
      "experimental-vm-modules": true
    },
  },
  // The transform property is commented out, if you need a custom transformer, uncomment and update the path
  // transform: {'\\.[jt]sx?$': 'ts-jest'},
  transform: {
     '\\.[jt]sx?$': '<rootDir>/fileTransformer.cjs'
  },
  transformIgnorePatterns: ['/node_modules/(?!(foo|bar)/)', '/bar/'],


  
  
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^src/(.*)": "<rootDir>/src/$1",
  }
}

export default jestConfig;
