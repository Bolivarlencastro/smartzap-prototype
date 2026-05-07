import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { CoreModule, KP_I18N_CONFIG, TranslocoRootModule } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from '../environments/environment';
import { CACHE_VERSION } from '../utils/version';
import { InitService } from './services/init.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslocoRootModule, CoreModule.forRoot(environment.coreModuleConfig)),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding()),
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    provideAppInitializer(() => {
      const initService = inject(InitService);
      return initService.init();
    }),
  ],
};
