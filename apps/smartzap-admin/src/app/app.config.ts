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
  FuseLoadingBarModule,
  FuseSplashScreenModule,
  KEEPS_NAVIGATION_ITEMS,
} from '@keeps-platform-frontend-workspace/layout';
import { AuthModule } from 'app/shared/auth/auth.module';
import { AppStoreModule } from 'app/shared/store/store.module';
import { CACHE_VERSION } from '@core/utils/version';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { KeepsMatPaginator } from 'app/shared/services/keeps-mat-paginator.service';
import { TranslocoService } from '@jsverse/transloco';
import { APP_BASE_HREF, HashLocationStrategy, Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { NavigationService } from 'app/shared/navigation/navigation.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFnsAdapter, provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideUILibTranslocoScope } from '@keeps-platform-frontend-workspace/ui/transloco-scope';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from 'app/app.routing';
import Keycloak from 'keycloak-js';
import { provideServiceWorker } from '@angular/service-worker';
import { NAVIGATION_ITEMS } from './shared/navigation/navigation-items';
import { PrototypeAdminMockInterceptor } from './prototype/prototype-admin-mock.interceptor';
import { providePrototypeAdminMode } from './prototype/prototype-admin.providers';

const authProviders = environment.prototypeMode
  ? [...providePrototypeAdminMode()]
  : [
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
    ];

const httpProviders = environment.prototypeMode
  ? [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: PrototypeAdminMockInterceptor,
        multi: true,
      },
      provideHttpClient(withInterceptorsFromDi()),
    ]
  : [
      provideHttpClient(withInterceptorsFromDi(), withInterceptors([customBearerTokenInterceptor])),
      provideBearerTokenInterceptorConfig(environment.bearerUrls, environment.apiDomainPattern),
    ];

const locationProviders = environment.pagesMode
  ? [
      { provide: APP_BASE_HREF, useValue: environment.appBaseHref },
      { provide: LocationStrategy, useClass: HashLocationStrategy },
    ]
  : [
      { provide: Location, useClass: KeepsLocation },
      { provide: LocationStrategy, useClass: KeepsPathLocationStrategy, deps: [PlatformLocation, WorkspaceService] },
    ];

const serviceWorkerProviders = environment.enableServiceWorker
  ? [
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ]
  : [];

const monitoringImports = environment.enableMonitoring
  ? [
      KpMonitoringModule.forRoot({
        appName: 'smartzap-admin-web',
        prod: environment.production,
      }),
    ]
  : [];

const updatesProviders = environment.enableUpdates ? [provideUpdates()] : [];

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      CoreModule.forRoot(environment.coreModuleConfig),
      // Fuse migration modules
      FuseConfigModule.forRoot(defaultConfig),
      FuseLoadingBarModule,
      FuseSplashScreenModule,
      FuseLayoutModule,
      // App modules
      AuthModule,
      AppStoreModule,
      TranslocoRootModule,
      ...monitoringImports,
    ),
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    { provide: MatPaginatorIntl, useClass: KeepsMatPaginator },
    ...authProviders,
    {
      provide: LOCALE_ID,
      useFactory: initializeAngularLocale,
      deps: [Keycloak],
    },
    ...locationProviders,
    { provide: KEEPS_NAVIGATION_ITEMS, useValue: NAVIGATION_ITEMS },
    { provide: AbstractNavigationService, useClass: NavigationService },
    {
      provide: DateAdapter,
      useClass: DateFnsAdapter,
    },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: MAT_DATE_LOCALE, useFactory: getDateAdapterLocale, deps: [Keycloak] },
    { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
    provideDateFnsAdapter(),
    ...httpProviders,
    provideIcons(),
    provideUILibTranslocoScope(),
    provideAnimations(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideTheming(),
    ...updatesProviders,
    ...serviceWorkerProviders,
  ],
};
