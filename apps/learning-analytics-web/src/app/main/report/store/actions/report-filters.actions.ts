import { createAction, props } from '@ngrx/store';
import { ReportFiltersSearch, ReportFiltersSearchType } from 'app/main/report/interfaces/report-filters-search';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { ReportType } from 'app/main/report/enums/report';

export const openDialog = createAction('[Report Filters] Open Dialog', props<{ reportType: ReportType }>());

export const filterSelectOptions = createAction(
  '[Report Filters] Filter Select Options',
  props<{ search: ReportFiltersSearch }>(),
);

export const filterSelectOptionsSuccess = createAction(
  '[Report Filters] Filter Select Options Success',
  props<{ searchType: ReportFiltersSearchType; results: KpFilterSelectOption[] }>(),
);

export const filterSelectOptionsFailure = createAction('[Report Filters] Filter Select Options Failure');

export const resetState = createAction('[Report Filters] Reset State');
