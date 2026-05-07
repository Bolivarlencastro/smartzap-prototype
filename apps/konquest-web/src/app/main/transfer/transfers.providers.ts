import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TransferService } from './services/transfer.service';
import * as fromStore from './store/reducers/transfer.reducer';
import { TransferEffects, TransfersFiltersEffects } from './store/effects';
import { transfersFiltersFeature } from './store/features';

export const TRANSFERS_PROVIDERS = [
  TransferService,
  importProvidersFrom(
    StoreModule.forFeature(fromStore.featureKey, fromStore.reducer),
    StoreModule.forFeature(transfersFiltersFeature),
    EffectsModule.forFeature([TransferEffects, TransfersFiltersEffects]),
  ),
];
