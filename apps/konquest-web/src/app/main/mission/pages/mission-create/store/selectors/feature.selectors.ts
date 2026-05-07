import { createFeatureSelector } from '@ngrx/store';
import { missionCreateFeatureKey, MissionCreateState } from '../reducers';

export const selectMissionCreateState = createFeatureSelector<MissionCreateState>(missionCreateFeatureKey);
