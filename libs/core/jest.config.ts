import type { Config } from 'jest';

const esModules = [
  'lodash-es',
  'quill',
  'parchment',
  '@angular/common/locales',
  '@material/material-color-utilities',
  '@material/material-color-utilities',
];

const config: Config = {
  displayName: 'core',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../coverage/core',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/core' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    'libs/core/src/**/*-sdk/**': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
    'libs/core/src/**/*-api/**': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

export default config;
