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
  KeepsSharedModule,
  KP_I18N_CONFIG,
  KpMonitoringModule,
  provideAppDomain,
  provideAppServices,
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
import { MatDialogModule } from '@angular/material/dialog';
import { DateFnsAdapter, DateFnsModule } from '@angular/material-date-fns-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AbstractNavigationService,
  defaultConfig,
  FuseAlertModule,
  FuseConfigModule,
  FuseLayoutModule,
  FuseLoadingBarModule,
  FuseLoadingModule,
  FuseModule,
  FuseSplashScreenModule,
  KEEPS_NAVIGATION_ITEMS,
} from '@keeps-platform-frontend-workspace/layout';
import { AppStoreModule } from 'app/shared/store/store.module';
import { AuthModule } from 'app/shared/auth/auth.module';
import { EVALUATION_PROVIDERS } from 'app/main/evaluation/evaluation.providers';
import { NotificationModule } from '@core/services/notification/notification.module';
import { CustomCertificatesModule } from '@keeps-platform-frontend-workspace/custom-certificates';
import { CACHE_VERSION } from '@core/utils/version';
import { Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { initializeRouteDialogService } from 'app/app.init';
import { RouteDialogService } from 'app/shared/services';
import { TranslocoService } from '@jsverse/transloco';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { KeepsMatPaginator } from 'app/shared/services/keeps-mat-paginator.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NAVIGATION_ITEMS } from 'app/navigation/navigation-items';
import { NavigationService } from 'app/navigation';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideUILibTranslocoScope } from '@keeps-platform-frontend-workspace/ui/transloco-scope';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from 'app/app.routing';
import { QUIZ_PROVIDERS } from '@keeps-platform-frontend-workspace/quiz';
import { MISSION_DETAIL_PROVIDERS } from 'app/main/mission/pages/mission-detail-v2/mission-detail-v2.provides';
import { LEARNING_TRAIL_DETAIL_PROVIDERS } from 'app/main/learning-trail/pages/detail/learning-trail-detail.module';
import { PULSE_DETAILS_PROVIDERS } from 'app/main/pulses-feed/pulse-details.provides';
import { GLOBAL_SEARCH_PROVIDERS } from 'app/main/global-search/global-search.providers';
import { provideAnimations } from '@angular/platform-browser/animations';
import Keycloak from 'keycloak-js';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      CoreModule.forRoot(environment.coreModuleConfig),
      MatDialogModule,
      DateFnsModule,
      // Material
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      // Fuse modules
      FuseConfigModule.forRoot(defaultConfig),
      FuseSplashScreenModule,
      FuseLoadingModule,
      FuseLoadingBarModule,
      FuseAlertModule,
      FuseLayoutModule,
      FuseModule,
      KeepsSharedModule,
      AppStoreModule,
      AuthModule,
      NotificationModule,
      TranslocoRootModule,
      CustomCertificatesModule,
      KpMonitoringModule.forRoot({
        appName: 'konquest-web',
        prod: environment.production,
      }),
    ),
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    { provide: LocationStrategy, useClass: KeepsPathLocationStrategy, deps: [PlatformLocation, WorkspaceService] },
    { provide: Location, useClass: KeepsLocation },
    provideKeycloak({
      config: environment.keycloakConfig,
    }),
    provideAppInitializer(() => {
      const initializerFn = initializeRouteDialogService(inject(RouteDialogService));
      return initializerFn();
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
    { provide: MatPaginatorIntl, useClass: KeepsMatPaginator },
    { provide: MAT_DATE_LOCALE, useFactory: getDateAdapterLocale, deps: [Keycloak] },
    {
      provide: DateAdapter,
      useClass: DateFnsAdapter,
    },
    { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
    { provide: KEEPS_NAVIGATION_ITEMS, useValue: NAVIGATION_ITEMS },
    { provide: AbstractNavigationService, useClass: NavigationService },
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([customBearerTokenInterceptor])),
    provideBearerTokenInterceptorConfig(environment.bearerUrls, environment.apiDomainPattern),
    provideUILibTranslocoScope(),
    provideIcons(),
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    ...QUIZ_PROVIDERS,
    ...MISSION_DETAIL_PROVIDERS,
    ...PULSE_DETAILS_PROVIDERS,
    ...LEARNING_TRAIL_DETAIL_PROVIDERS,
    ...EVALUATION_PROVIDERS,
    ...GLOBAL_SEARCH_PROVIDERS,
    provideAnimations(),
    provideTheming(),
    provideUpdates(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAppDomain(environment.apps.konquest.url),
    provideAppServices(environment.apps.konquest.services),
  ],
};
