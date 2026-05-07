import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LinkCycleService } from './services/link-cycle.service';
import { LinkCycleEffects, linkCycleFeature } from './store';

export const LINK_CYCLE_DIALOG_PROVIDERS = [
  LinkCycleService,
  importProvidersFrom(StoreModule.forFeature(linkCycleFeature), EffectsModule.forFeature(LinkCycleEffects)),
];
