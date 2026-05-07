import { createFeatureSelector } from '@ngrx/store';
import { missionDetailDialogFeatureKey, MissionDetailDialogFeatureState } from '../reducers';

export const selectDetailDialogState =
  createFeatureSelector<MissionDetailDialogFeatureState>(missionDetailDialogFeatureKey);
