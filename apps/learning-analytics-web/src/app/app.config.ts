import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ApplicationServicesApi,
  CoreModule,
  getDateAdapterLocale,
  initializeAngularLocale,
  initializer,
  KEEPS_DATE_FORMATS,
  KeepsLocation,
  KeepsPathLocationStrategy,
  KP_I18N_CONFIG,
  KpMonitoringModule,
  provideBearerTokenInterceptorConfig,
  provideIcons,
  provideTheming,
  provideUpdates,
  TranslocoRootModule,
  UserProfileService,
  WorkspaceApi,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { customBearerTokenInterceptor, provideKeycloak } from 'keycloak-angular';
import {
  AbstractNavigationService,
  defaultConfig,
  FuseConfigModule,
  FuseLayoutModule,
  FuseLoadingModule,
  FuseSplashScreenModule,
  KEEPS_NAVIGATION_ITEMS,
} from '@keeps-platform-frontend-workspace/layout';
import { AppStoreModule } from 'app/shared/store/store.module';
import { AuthModule } from 'app/shared/auth/auth.module';
import { CACHE_VERSION } from '@core/utils/version';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { KeepsMatPaginator } from 'app/shared/services/keeps-mat-paginator.service';
import { TranslocoService } from '@jsverse/transloco';
import { NAVIGATION_ITEMS, NavigationService } from 'app/shared/navigation';
import { Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideUILibTranslocoScope } from '@keeps-platform-frontend-workspace/ui/transloco-scope';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from 'app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import Keycloak from 'keycloak-js';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      CoreModule.forRoot(environment.coreModuleConfig),
      FuseConfigModule.forRoot(defaultConfig),
      FuseLoadingModule,
      FuseSplashScreenModule,
      FuseLayoutModule,
      AppStoreModule,
      AuthModule,
      TranslocoRootModule,
      KpMonitoringModule.forRoot({
        appName: 'learning-analytics-web',
        prod: environment.production,
      }),
    ),
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    { provide: MatPaginatorIntl, useClass: KeepsMatPaginator },
    provideKeycloak({
      config: environment.keycloakConfig,
    }),
    provideAppInitializer(() => {
      const initializerFn = initializer(
        inject(Keycloak),
        inject(WorkspaceApi),
        inject(WorkspaceService),
        inject(UserProfileService),
        inject(TranslocoService),
        inject(KeepsPathLocationStrategy),
        inject(ApplicationServicesApi),
      );
      return initializerFn();
    }),
    {
      provide: LOCALE_ID,
      useFactory: initializeAngularLocale,
      deps: [Keycloak],
    },
    { provide: KEEPS_NAVIGATION_ITEMS, useValue: NAVIGATION_ITEMS },
    { provide: AbstractNavigationService, useClass: NavigationService },
    { provide: Location, useClass: KeepsLocation },
    { provide: LocationStrategy, useClass: KeepsPathLocationStrategy, deps: [PlatformLocation, WorkspaceService] },
    { provide: MAT_DATE_LOCALE, useFactory: getDateAdapterLocale, deps: [Keycloak] },
    { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
    provideDateFnsAdapter(),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([customBearerTokenInterceptor])),
    provideBearerTokenInterceptorConfig(environment.bearerUrls, environment.apiDomainPattern),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    provideIcons(),
    provideUILibTranslocoScope(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideAnimations(),
    provideTheming(),
    provideUpdates(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
