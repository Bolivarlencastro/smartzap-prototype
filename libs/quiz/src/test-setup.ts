import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});
