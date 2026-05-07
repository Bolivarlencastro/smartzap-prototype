import { createAction, props } from '@ngrx/store';
import { EvaluationsFilterResult } from '../../evaluation/evaluations-filter-modal/models';

export const openFilterDialog = createAction(
  '[Evaluations Filter] Open Dialog',
  props<{
    id: string;
  }>(),
);

export const storeFilterControllerState = createAction(
  '[Evaluations Filter] Store Filter State',
  props<{
    filterState: EvaluationsFilterResult;
  }>(),
);
