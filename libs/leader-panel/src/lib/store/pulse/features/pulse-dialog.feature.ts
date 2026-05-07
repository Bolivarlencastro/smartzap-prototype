import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Pulse } from '../../../models/pulse';
import { PulseDialogData, PulseDialogViewModel } from '../../../models/pulse-dialog';
import { PulseDialogActions } from '../actions';

export interface PulseDialogFeatureState {
  selectedPulse: Pulse;
  loading: boolean;
  data: PulseDialogData;
}

export const pulseDialogInitialState: PulseDialogFeatureState = {
  selectedPulse: null,
  loading: true,
  data: null,
};

const reducer = createReducer(
  pulseDialogInitialState,

  on(
    PulseDialogActions.openDialog,
    (state, { selectedPulse }): PulseDialogFeatureState => ({ ...state, selectedPulse }),
  ),

  on(
    PulseDialogActions.fetchDataSuccess,
    (state, { data }): PulseDialogFeatureState => ({ ...state, loading: false, data }),
  ),

  on(PulseDialogActions.fetchDataFailure, (state): PulseDialogFeatureState => ({ ...state, loading: false })),

  on(PulseDialogActions.resetState, (): PulseDialogFeatureState => pulseDialogInitialState),
);

export const pulseDialogFeature = createFeature({
  name: 'pulse-dialog',
  reducer,
  extraSelectors: ({ selectSelectedPulse, selectLoading, selectData }) => ({
    selectPulseId: createSelector(selectSelectedPulse, (pulse): string => pulse.id),
    selectViewModel: createSelector(
      selectSelectedPulse,
      selectLoading,
      selectData,
      (pulse, loading, data): PulseDialogViewModel => ({
        pulse,
        loading,
        data,
      }),
    ),
  }),
});
