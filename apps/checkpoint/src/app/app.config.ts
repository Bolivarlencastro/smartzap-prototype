import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  CoreModule,
  initializeAngularLocale,
  KP_I18N_CONFIG,
  provideBearerTokenInterceptorConfig,
  provideIcons,
  provideTheming,
  TranslocoRootModule,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from '../environments/environment';
import { CACHE_VERSION } from '../utils/version';
import { customBearerTokenInterceptor, provideKeycloak } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { InitService } from './services/init.service';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { xClientInterceptor } from './interceptors/x-client.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslocoRootModule, CoreModule.forRoot(environment.coreModuleConfig)),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    provideKeycloak({
      config: environment.keycloakConfig,
    }),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([customBearerTokenInterceptor, xClientInterceptor])),
    provideBearerTokenInterceptorConfig(environment.bearerUrls, environment.apiDomainPattern),
    provideAppInitializer(() => {
      const initService = inject(InitService);
      return initService.init();
    }),
    provideIcons(),
    provideTheming(),
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    {
      provide: LOCALE_ID,
      useFactory: initializeAngularLocale,
      deps: [Keycloak],
    },
  ],
};
