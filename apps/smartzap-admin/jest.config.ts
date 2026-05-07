import type { Config } from 'jest';

const esModules = [
  'lodash-es',
  'file-saver-es',
  'quill',
  'parchment',
  '@angular/common/locales',
  '@material/material-color-utilities',
];

const config: Config = {
  displayName: 'smartzap-admin',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  globals: { VERSION: 'test-version' },
  coverageDirectory: '../../coverage/smartzap-admin',
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
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/smartzap-admin' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
  coverageThreshold: {
    global: {
      branches: 44,
      functions: 34,
      lines: 46,
      statements: 45,
    },
  },
};

export default config;
