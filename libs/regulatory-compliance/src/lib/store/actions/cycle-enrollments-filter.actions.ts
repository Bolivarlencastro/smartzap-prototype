import { createAction, props } from '@ngrx/store';
import { CycleEnrollmentsFilterACType, CycleEnrollmentsFilterResult } from '../../models';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export const openFilterDialog = createAction('[Compliance Enrollments Filter] Open Dialog');

export const autocompleteSearch = createAction(
  '[Compliance Enrollments Filter] Autocomplete Search',
  props<{
    searchType: CycleEnrollmentsFilterACType;
    search: string;
  }>(),
);

export const autocompleteSearchSuccess = createAction(
  '[Compliance Enrollments Filter] Autocomplete Search Success',
  props<{
    searchType: CycleEnrollmentsFilterACType;
    results: KpFilterSelectOption[];
  }>(),
);

export const autocompleteSearchFailure = createAction('[Compliance Enrollments Filter] Autocomplete Search Failure');

export const storeFilterControllerState = createAction(
  '[Compliance Enrollments Filter] Store Filter State',
  props<{
    filterState: CycleEnrollmentsFilterResult;
  }>(),
);
