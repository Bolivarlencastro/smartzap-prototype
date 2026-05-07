import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers, transferDialogFeatureKey } from './store';
import { EffectsModule } from '@ngrx/effects';
import { TransferDialogEffects } from './store/effects';

const EFFECTS = [TransferDialogEffects];

export const TRANSFER_DIALOG_PROVIDERS = [
  importProvidersFrom(StoreModule.forFeature(transferDialogFeatureKey, reducers), EffectsModule.forFeature(EFFECTS)),
];
