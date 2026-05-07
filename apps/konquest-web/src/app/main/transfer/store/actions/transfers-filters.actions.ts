import { createAction, props } from '@ngrx/store';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { TransfersFiltersSearchType } from '../../models/transfers-filters-search-type';
import { TransfersFiltersResult } from 'app/main/transfer/models/transfers-filters-result';

export const openFilterDialog = createAction('[Transfers Filters] Open Filter Dialog');

export const filterSelectOptions = createAction(
  '[Transfers Filters] Filter Select Options',
  props<{ search: string; searchType: TransfersFiltersSearchType }>(),
);

export const filterSelectOptionsSuccess = createAction(
  '[Transfers Filters] Filter Select Options Success',
  props<{ searchType: TransfersFiltersSearchType; results: KpFilterSelectOption[] }>(),
);

export const initialFilterSelectOptionsSuccess = createAction(
  '[Transfers Filters] Initial Filter Select Options Success',
  props<{ results: KpFilterSelectOption[] }>(),
);

export const filterSelectOptionsFailure = createAction('[Transfers Filters] Filter Select Options Failure');

export const storeFilterControllerState = createAction(
  '[Transfers Filters] Store Filter State',
  props<{
    filterState: TransfersFiltersResult;
  }>(),
);
