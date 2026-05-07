import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

jest.mock('@jsverse/transloco-keys-manager/marker', () => ({
  marker: jest.fn((x) => x),
}));

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});
