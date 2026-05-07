import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

jest.mock('@jsverse/transloco-keys-manager/marker', () => ({
  marker: jest.fn((x) => x),
}));
