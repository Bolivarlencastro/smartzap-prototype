import { createAction, props } from '@ngrx/store';
import { PageResponse } from '@core/model/search-api';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LearnContentListFilter, LearnContentManagementType } from '../../models/learn-content-list-filter';
import { LearnContentListItemEvent } from 'app/main/content-management/models/learn-content-list-item-event';
import { Update } from '@ngrx/entity';

export const loadLearnContentsByType = createAction(
  '[Content Management] Load Learn Contents By Type',
  props<{ contentType: LearnContentManagementType; forceFilterOnlyManaged: boolean }>(),
);

export const loadLearnContents = createAction('[Content Management] Load Learn Contents');

export const loadLearnContentsSuccess = createAction(
  '[Content Management] Load Learn Contents Success',
  props<{ result: PageResponse<LearnContentListItem> }>(),
);

export const loadLearnContentsFailure = createAction(
  '[Content Management] Load Learn Contents Failure',
  props<{ error: unknown }>(),
);

export const setFilter = createAction(
  '[Content Management] Set Filter',
  props<{ filter: Partial<LearnContentListFilter> }>(),
);

export const setPagination = createAction(
  '[Content Management] Set Pagination',
  props<{ page: number; perPage: number }>(),
);

export const resetState = createAction('[Content Management] Reset State');

export const loadCoursesFilterData = createAction('[Content Management] Load Courses Filter Data');

export const loadChannelsFilterData = createAction('[Content Management] Load Channels Filter Data');

export const executeAction = createAction(
  '[Content Management] Execute Action',
  props<{ event: LearnContentListItemEvent }>(),
);

export const executeActionNoopResult = createAction('[Content Management] Execute Action Noop Result');

export const executeActionErrorResult = createAction(
  '[Content Management] Execute Action Error Result',
  props<{
    error: unknown;
  }>(),
);

export const removeItemActionResult = createAction(
  '[Content Management] Remove Item Action Result',
  props<{ id: string }>(),
);

export const updateItemActionResult = createAction(
  '[Content Management] Update Item Action Result',
  props<{ update: Update<LearnContentListItem> }>(),
);
