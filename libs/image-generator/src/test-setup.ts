import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

jest.mock('@jsverse/transloco-keys-manager/marker', () => ({
  marker: jest.fn((x) => x),
}));
