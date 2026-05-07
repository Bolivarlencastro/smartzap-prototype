import { Group } from '@app/main/group/groups/group.model';
import { VinculateGroupType } from '@app/shared/components/vinculate-to-group/models';
import { createFeature, createReducer, on } from '@ngrx/store';
import { VinculateToGroupActions } from '../actions';

export interface VinculateToGroupFeatureState {
  groups: Group[];
  vinculateType: VinculateGroupType;
  contentId: string;
  search: string;
  loading: boolean;
}

export const vinculateToGroupInitialState: VinculateToGroupFeatureState = {
  groups: null,
  vinculateType: null,
  contentId: null,
  search: null,
  loading: true,
};

const vinculateToGroupReducer = createReducer(
  vinculateToGroupInitialState,

  on(
    VinculateToGroupActions.openDialog,
    (state, { vinculateType, contentId }): VinculateToGroupFeatureState => ({ ...state, vinculateType, contentId }),
  ),

  on(
    VinculateToGroupActions.loadGroups,
    (state): VinculateToGroupFeatureState => ({ ...state, groups: null, loading: true }),
  ),

  on(
    VinculateToGroupActions.loadGroupsSuccess,
    (state, { groups }): VinculateToGroupFeatureState => ({ ...state, groups, loading: false }),
  ),

  on(VinculateToGroupActions.search, (state, { search }): VinculateToGroupFeatureState => ({ ...state, search })),

  on(VinculateToGroupActions.resetState, (): VinculateToGroupFeatureState => vinculateToGroupInitialState),
);

export const vinculateToGroupFeature = createFeature({
  name: 'vinculateToGroupFeature',
  reducer: vinculateToGroupReducer,
});
