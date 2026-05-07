import { createFeature, createReducer, on } from '@ngrx/store';
import { GroupDetailActions } from '.';
import { Group } from '../../groups/group.model';

export interface GroupDetailFeatureState {
  group: Group;
}

export const groupDetailInitialState: GroupDetailFeatureState = {
  group: null,
};

export const groupDetailReducer = createReducer(
  groupDetailInitialState,

  on(GroupDetailActions.getGroupDetailSuccess, (state, { group }): GroupDetailFeatureState => ({ ...state, group })),

  on(GroupDetailActions.reset, (): GroupDetailFeatureState => groupDetailInitialState),
);

export const groupDetailFeature = createFeature({
  name: 'groupDetail',
  reducer: groupDetailReducer,
});
