import {
  GamificationListDto,
  GamificationListType,
  GamificationPagination,
  KpDateRange,
  Pagination,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction(
  '[Gamification List] Init',
  props<{ path: GamificationListType; isMobile: boolean }>(),
);

export const setInitialSetting = createAction(
  '[Gamification List] Set Initial Setting',
  props<{ path: GamificationListType; isMobile: boolean; personalScore?: number }>(),
);

export const loadData = createAction('[Gamification List] Load Data');

export const loadDataSuccess = createAction(
  '[Gamification List] Load Data Success',
  props<{ response: Pagination<GamificationListDto> }>(),
);

export const filterByTerm = createAction('[Gamification List] Filter By Term', props<{ search: string }>());

export const setPagination = createAction(
  '[Gamification List] Set Pagination',
  props<{ pagination: Partial<GamificationPagination> }>(),
);

export const filterByDateRange = createAction(
  '[Gamification List] Filter By Date Range',
  props<{ dateRange: KpDateRange }>(),
);

export const cleanDateRangeFilter = createAction('[Gamification List] Clean Date Range Filter');

export const cleanFilter = createAction('[Gamification List] Clean Filter');

export const resetState = createAction('[Gamification List] Reset State');
