import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared-ui-layout',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../coverage/shared-ui-layout',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  reporters: ['default'],
  coverageReporters: ['text-summary', 'lcovonly'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};

export default config;
