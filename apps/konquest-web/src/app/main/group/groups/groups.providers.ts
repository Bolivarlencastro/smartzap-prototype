import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GroupTestEffects } from './store/group.effects';
import * as fromGroup from './store/group.reducer';

export const GROUPS_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(fromGroup.groupFeatureKey, fromGroup.reducer),
    EffectsModule.forFeature([GroupTestEffects]),
  ),
];
