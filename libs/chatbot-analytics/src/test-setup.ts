import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Plotly.js requires 'URL.createObjectURL', which is mocked here for Jest.
global.URL.createObjectURL = jest.fn(() => 'mockedObjectURL');

jest.mock('@jsverse/transloco-keys-manager/marker', () => ({
  marker: jest.fn((x) => x),
}));
