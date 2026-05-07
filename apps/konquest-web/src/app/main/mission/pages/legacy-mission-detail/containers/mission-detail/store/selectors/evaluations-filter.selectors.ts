import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EvaluationsFilterState, evaluationsFilterFeatureKey } from '../reducers/evaluations-filter.reducer';

const selectEvaluationsFilterState = createFeatureSelector<EvaluationsFilterState>(evaluationsFilterFeatureKey);

export const selectViewModel = createSelector(selectEvaluationsFilterState, (state) => state);
