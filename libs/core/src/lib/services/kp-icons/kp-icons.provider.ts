import { EnvironmentProviders, inject, provideEnvironmentInitializer, Provider } from '@angular/core';
import { KpIconsService } from './kp-icons.service';

export const provideIcons = (): Array<Provider | EnvironmentProviders> => {
  return [provideEnvironmentInitializer(() => inject(KpIconsService))];
};
