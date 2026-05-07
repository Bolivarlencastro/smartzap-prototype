import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WorkspacesListService } from './services';
import { WorkspacesEffects, WorkspacesReducers } from './store';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';

export interface WorkspacesConfig {
  logoUrl: string;
  isMyAccount?: boolean;
  environment?: any;
}

export const WORKSPACES_CONFIG = new InjectionToken<WorkspacesConfig>('kp-workspaces-config');

function ConfigFactory() {
  return WorkspacesModule.moduleConfig;
}

const loader: InlineLoader = ['en', 'es', 'pt-BR', 'pt-PT'].reduce((acc, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {} as InlineLoader);

@NgModule({
  imports: [
    CommonModule,
    WorkspacesRoutingModule,
    EffectsModule.forFeature([WorkspacesEffects]),
    StoreModule.forFeature(WorkspacesReducers.workspacesFeatureKey, WorkspacesReducers.reducer),
  ],
  providers: [
    { provide: WORKSPACES_CONFIG, useFactory: ConfigFactory },
    WorkspacesListService,
    provideTranslocoScope({
      scope: 'workspaces',
      alias: 'WORKSPACES_FEATURE',
      loader,
    }),
  ],
})
export class WorkspacesModule {
  private static _moduleConfig: WorkspacesConfig;

  static get moduleConfig(): WorkspacesConfig {
    return this._moduleConfig;
  }

  static set moduleConfig(config: WorkspacesConfig) {
    this._moduleConfig = config;
  }
}
