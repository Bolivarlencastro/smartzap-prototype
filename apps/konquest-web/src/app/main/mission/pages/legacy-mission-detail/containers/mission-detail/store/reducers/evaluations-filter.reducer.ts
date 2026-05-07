import { createReducer, on } from '@ngrx/store';
import { EvaluationsFilterResult } from '../../evaluation/evaluations-filter-modal/models';
import { EvaluationsFilterActions } from '../actions';

export const evaluationsFilterFeatureKey = 'evaluations-filter';

export interface EvaluationsFilterState {
  isLoading: boolean;
  filterState: EvaluationsFilterResult | undefined;
}

export const evaluationsFilterInitialState: EvaluationsFilterState = {
  isLoading: false,
  filterState: undefined,
};

export const evaluationsFilterReducer = createReducer(
  evaluationsFilterInitialState,

  on(
    EvaluationsFilterActions.storeFilterControllerState,
    (state, { filterState }): EvaluationsFilterState => ({
      ...state,
      filterState,
    }),
  ),
);
