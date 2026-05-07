import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CACHE_VERSION } from '@core/utils/version';
import {
  APPLICATION_TYPE,
  CAIXA_APPLICATION_TYPE,
  CoreModule,
  KP_I18N_CONFIG,
  KpMonitoringModule,
  provideIcons,
  TranslocoRootModule,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseModule } from '@keeps-platform-frontend-workspace/layout';
import { provideUILibTranslocoScope } from '@keeps-platform-frontend-workspace/ui/transloco-scope';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from 'app/app.component';
import { environment } from 'environments/environment';
import { AppRoutingModule } from './app.routing';
import { CAIXA_AGENCIES_WHATSAPP, CAIXA_APP_WHATSAPP_URL, CaixaModule } from '@keeps-platform-frontend-workspace/caixa';

registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CaixaModule,
    FuseModule,
    AppRoutingModule,
    TranslocoRootModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot({}),
    CoreModule.forRoot(environment.coreModuleConfig),
    KpMonitoringModule.forRoot({ appName: 'caixa-agencies-web', prod: environment.production }),
  ],
  providers: [
    { provide: KP_I18N_CONFIG, useValue: { prodMode: environment.production, cacheVersion: CACHE_VERSION } },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: APPLICATION_TYPE, useValue: CAIXA_APPLICATION_TYPE.AGENCIES },
    { provide: CAIXA_APP_WHATSAPP_URL, useValue: CAIXA_AGENCIES_WHATSAPP },
    provideIcons(),
    provideHttpClient(withInterceptorsFromDi()),
    provideUILibTranslocoScope(),
  ],
})
export class AppModule {}
