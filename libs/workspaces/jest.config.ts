import type { Config } from 'jest';

const esModules = ['lodash-es', 'quill', 'parchment', '@angular/common/locales', '@material/material-color-utilities'];

const config: Config = {
  displayName: 'workspaces',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/workspaces',
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
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/workspaces' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/lib/store/'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 45,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
