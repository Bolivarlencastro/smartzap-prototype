import type { Config } from 'jest';

const esModules = [
  '@amcharts',
  'lodash-es',
  'quill',
  'parchment',
  'vidstack/server',
  '@angular/common/locales',
  '@material/material-color-utilities',
];

const config: Config = {
  displayName: 'konquest',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  globals: { VERSION: 'test-version' },
  globalSetup: '<rootDir>/jest-global-setup.js',
  coverageDirectory: '../../coverage/konquest-web',
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
  collectCoverageFrom: ['src/app/**/*.{js,ts}', 'src/@core/**/*.{js,ts}', 'src/@keeps/**/*.{js,ts}'],
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/konquest-web' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 28,
      lines: 44,
      statements: 44,
    },
  },
};

export default config;
