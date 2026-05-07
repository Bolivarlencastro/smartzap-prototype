import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MissionTransferService } from './services/mission-transfer.service';
import { MissionTransferEffects, MissionTransferReducer } from './store';

export const MISSION_TRANSFER_PROVIDERS = [
  MissionTransferService,
  importProvidersFrom(
    StoreModule.forFeature(
      MissionTransferReducer.missionTransferFeatureKey,
      MissionTransferReducer.missionTransferReducers,
    ),
    EffectsModule.forFeature([MissionTransferEffects]),
  ),
];
