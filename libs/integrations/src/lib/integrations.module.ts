import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { integrationsRoutes } from './lib.routes';
import { IntegrationsService } from './services';
import {
  aluraCourseMirrorFeature,
  coursesListFeature,
  FEATURE_EFFECTS,
  integrationsFeature,
  tokensDialogFeature,
} from './store';

export interface IntegrationsConfig {
  environment: any;
}

export const INTEGRATIONS_CONFIG = new InjectionToken<IntegrationsConfig>('kp-integrations-config');

function ConfigFactory() {
  return IntegrationsModule.moduleConfig;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(integrationsRoutes),
    StoreModule.forFeature(coursesListFeature),
    StoreModule.forFeature(integrationsFeature),
    StoreModule.forFeature(aluraCourseMirrorFeature),
    StoreModule.forFeature(tokensDialogFeature),
    EffectsModule.forFeature(FEATURE_EFFECTS),
  ],
  providers: [IntegrationsService, { provide: INTEGRATIONS_CONFIG, useFactory: ConfigFactory }],
})
export class IntegrationsModule {
  private static _moduleConfig: IntegrationsConfig;

  static get moduleConfig(): IntegrationsConfig {
    return this._moduleConfig;
  }

  static set moduleConfig(config: IntegrationsConfig) {
    this._moduleConfig = config;
  }
}
