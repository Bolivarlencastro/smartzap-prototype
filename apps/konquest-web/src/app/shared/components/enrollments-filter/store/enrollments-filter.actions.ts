import { createAction, props } from '@ngrx/store';
import {
  EnrollmentFilterResult,
  EnrollmentFiltersSearch,
  EnrollmentFiltersSearchType,
  EnrollmentType,
} from '../model/enrollment-filter';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export const openFilterDialog = createAction(
  '[Enrollments Filter] Open Dialog',
  props<{ enrollmentType: EnrollmentType }>(),
);

export const storeFilterControllerState = createAction(
  '[Enrollments Filter] Store Filter State',
  props<{ enrollmentType: EnrollmentType; filterState: Partial<EnrollmentFilterResult> }>(),
);

export const filterSelectOptions = createAction(
  '[Enrollments Filter] Filter Select Options',
  props<{ search: EnrollmentFiltersSearch }>(),
);

export const filterSelectOptionsSuccess = createAction(
  '[Enrollments Filter] Filter Select Options Success',
  props<{ searchType: EnrollmentFiltersSearchType; results: KpFilterSelectOption[] }>(),
);

export const filterSelectOptionsFailure = createAction('[Enrollments Filter] Filter Select Options Failure');

export const resetState = createAction('[Enrollments Filter] Reset State');
