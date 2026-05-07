import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Service } from './my-account-sdk';

export type KeepsAppServices = Record<string, Service>;

export const KEEPS_APP_SERVICES = new InjectionToken<KeepsAppServices>('keeps-application-services');

export const provideAppServices = (services: KeepsAppServices) => {
  return makeEnvironmentProviders([{ provide: KEEPS_APP_SERVICES, useValue: services }]);
};
