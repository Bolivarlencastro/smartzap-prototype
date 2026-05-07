import type { Config } from 'jest';

const esModules = ['lodash-es', 'quill', 'parchment', '@angular/common/locales', '@material/material-color-utilities'];

const config: Config = {
  displayName: 'custom-certificates',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/custom-certificates',
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
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/custom-certificates' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
};

export default config;
