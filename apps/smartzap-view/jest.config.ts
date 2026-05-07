import type { Config } from 'jest';

const esModules = [
  'lodash-es',
  'file-saver-es',
  'quill',
  'parchment',
  'vidstack/server',
  '@angular/common/locales',
  '@material/material-color-utilities',
];

const config: Config = {
  displayName: 'smartzap-view',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  globals: { VERSION: 'test-version' },
  coverageDirectory: '../../coverage/smartzap-view',
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
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/smartzap-view' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0.9,
      statements: 1,
    },
  },
};

export default config;
