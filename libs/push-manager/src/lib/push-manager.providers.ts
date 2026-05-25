import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CreationService } from './services/creation.service';
import { PanelService } from './services/panel.service';
import {
  creationFeature,
  panelFeature,
  pushHistoryFeature,
  upcomingAppointmentsFeature,
  PUSH_MANAGER_EFFECTS,
} from './store';
import { getTranslocoScope } from './transloco-scope.factory';

const SERVICES = [getTranslocoScope(), CreationService, PanelService];

export const PUSH_MANAGER_PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(panelFeature),
    StoreModule.forFeature(creationFeature),
    StoreModule.forFeature(upcomingAppointmentsFeature),
    StoreModule.forFeature(pushHistoryFeature),
    EffectsModule.forFeature(PUSH_MANAGER_EFFECTS),
  ]),
  ...SERVICES,
];
