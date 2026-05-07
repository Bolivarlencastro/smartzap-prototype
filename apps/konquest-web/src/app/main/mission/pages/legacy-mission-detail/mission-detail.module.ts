import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EvaluationsFilterService } from '../../services/evaluations-filter.service';
import { EvaluationsFilterEffects, MissionDetailEffects } from './containers/mission-detail/store/effects';
import { missionDetailFeatureKey, reducers } from './containers/mission-detail/store/reducers';
import {
  evaluationsFilterFeatureKey,
  evaluationsFilterReducer,
} from './containers/mission-detail/store/reducers/evaluations-filter.reducer';
import { EffectsModule } from '@ngrx/effects';

export const LEGACY_MISSION_DETAIL_PROVIDERS = [
  EvaluationsFilterService,
  importProvidersFrom(
    StoreModule.forFeature(missionDetailFeatureKey, reducers),
    StoreModule.forFeature(evaluationsFilterFeatureKey, evaluationsFilterReducer),
    EffectsModule.forFeature([EvaluationsFilterEffects, MissionDetailEffects]),
  ),
];
