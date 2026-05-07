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
  displayName: 'leader-panel',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-canvas-mock', '<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/leader-panel',
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
  reporters: ['default', ['@casualbot/jest-sonar-reporter', { outputDirectory: 'coverage/leader-panel' }]],
  coverageReporters: ['text-summary', 'lcovonly'],
};

export default config;
