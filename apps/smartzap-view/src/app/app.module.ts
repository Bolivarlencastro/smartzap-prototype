import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@core/services';
import { prototypeWorkspace } from '@core/prototype/prototype-fixtures';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { PrototypeHomeComponent } from './main/prototype-home/prototype-home.component';
import { httpInterceptorProviders } from '@core/interceptors';
import { MatButtonModule } from '@angular/material/button';
import { KpMonitoringModule, provideIcons, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { environment } from 'environments/environment';

export function setSessionToken(authService: AuthService, workspaceService: WorkspaceService) {
  return () => {
    return new Promise<void>((resolve) => {
      document.getElementById('splash').classList.add('splash-hidden');
      if (environment.prototypeMode) {
        authService.enablePrototypeSession();
        workspaceService.setCurrentWorkspace(prototypeWorkspace);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        authService.authenticate(token);
      }
      return resolve();
    });
  };
}

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, PrototypeHomeComponent],
  bootstrap: [AppComponent],
  imports: [
    // Angular
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // App
    LayoutModule,
    MatButtonModule,
    KpMonitoringModule.forRoot({ appName: 'smartzap-view-web', prod: environment.production }),
  ],
  providers: [
    httpInterceptorProviders,
    provideIcons(),
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    provideAppInitializer(() => {
      const initializerFn = setSessionToken(inject(AuthService), inject(WorkspaceService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
