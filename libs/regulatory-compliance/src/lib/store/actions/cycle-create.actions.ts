import { createAction, props } from '@ngrx/store';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { CycleCreateDto, CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleCreateFilter, CycleCreateFilterType } from '../../models';

export const openNewCycleDialog = createAction('[Cycle Create] Open New Cycle Dialog');

export const openEditCycleDialog = createAction('[Cycle Create] Open Edit Cycle Dialog', props<{ cycle: CycleDto }>());

export const dialogClosed = createAction('[Cycle Create] Dialog Closed');

export const saveNormativeCycle = createAction(
  '[Cycle Create] Save Normative Cycle',
  props<{ cycle: CycleCreateDto }>(),
);

export const saveNormativeCycleSuccess = createAction('[Cycle Create] Save Normative Cycle Success');

export const saveNormativeCycleFailure = createAction('[Cycle Create] Save Normative Cycle Failure');

export const loadCycleForEdition = createAction('[Cycle Create] Load Cycle For Edition', props<{ cycleId: string }>());

export const loadCycleForEditionSuccess = createAction(
  '[Cycle Create] Load Cycle For Edition Success',
  props<{
    cycle: CycleDto;
  }>(),
);

export const loadCycleForEditionFailure = createAction('[Cycle Create] Load Cycle For Edition Failure');

export const deleteNormativeCycles = createAction(
  '[Cycle Create] Delete Normative Cycles',
  props<{
    ids: string[];
  }>(),
);

export const deleteNormativeCyclesSuccess = createAction('[Cycle Create] Delete Normative Cycles Success');

export const loadJobsAndFunctionsSuccess = createAction(
  '[Cycle Create] Load Jobs and Functions Success',
  props<{
    jobs: KpAutocompleteOption[];
    jobFunctions: KpAutocompleteOption[];
  }>(),
);

export const filterItems = createAction('[Cycle Create] Filter Items', props<{ search: CycleCreateFilter }>());

export const filterItemsSuccess = createAction(
  '[Cycle Create] Filter Items Success',
  props<{
    results: KpAutocompleteOption[];
    searchType: CycleCreateFilterType;
  }>(),
);

export const filterItemsFailure = createAction('[Cycle Create] Filter Items Failure');

export const resetState = createAction('[Cycle Create] Reset State');
