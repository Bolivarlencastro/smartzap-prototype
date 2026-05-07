// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

jest.mock('@jsverse/transloco-keys-manager/marker', () => ({
  marker: jest.fn((x) => x),
}));

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
