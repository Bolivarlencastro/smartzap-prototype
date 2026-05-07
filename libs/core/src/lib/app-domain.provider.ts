import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export const APPLICATION_DOMAIN = new InjectionToken<string>('app-domain');

/**
 * Provides an application-specific domain to be used within the environment configuration.
 */
export const provideAppDomain = (applicationDomain: string): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: APPLICATION_DOMAIN, useValue: applicationDomain }]);
};
