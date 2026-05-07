import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Trail } from '../../../models/trail';
import { TrailDialogActions } from '../actions';
import { TrailDialogData, TrailDialogViewModel } from '../../../models/trail-dialog';

export interface TrailDialogFeatureState {
  selectedTrail: Trail;
  loading: boolean;
  data: TrailDialogData;
}

export const trailDialogInitialState: TrailDialogFeatureState = {
  selectedTrail: null,
  loading: true,
  data: null,
};

const reducer = createReducer(
  trailDialogInitialState,

  on(
    TrailDialogActions.openDialog,
    (state, { selectedTrail }): TrailDialogFeatureState => ({ ...state, selectedTrail }),
  ),

  on(
    TrailDialogActions.fetchDataSuccess,
    (state, { data }): TrailDialogFeatureState => ({ ...state, loading: false, data }),
  ),

  on(TrailDialogActions.fetchDataFailure, (state): TrailDialogFeatureState => ({ ...state, loading: false })),

  on(TrailDialogActions.resetState, (): TrailDialogFeatureState => trailDialogInitialState),
);

export const trailDialogFeature = createFeature({
  name: 'trail-dialog',
  reducer,
  extraSelectors: ({ selectSelectedTrail, selectLoading, selectData }) => ({
    selectTrailId: createSelector(selectSelectedTrail, (trail): string => trail?.learning_trail_id),
    selectViewModel: createSelector(
      selectSelectedTrail,
      selectLoading,
      selectData,
      (trail, loading, data): TrailDialogViewModel => ({ trail, loading, data }),
    ),
  }),
});
