import { createAction, props } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';

export const searchItems = createAction(
  '[Courses Filter List] Search list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const searchItemsSuccess = createAction(
  '[Courses Filter List] Search list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const searchItemsFailure = createAction(
  '[Courses Filter List] Search list items failure',
  props<{ error: Error }>(),
);

export const loadFilterItems = createAction(
  '[Courses Filter List] Load filter list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const loadFilterItemsSuccess = createAction(
  '[Courses Filter List] Load filter list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const loadFilterItemsFailure = createAction(
  '[Courses Filter List] Load filter list items failure',
  props<{ error: Error }>(),
);

export const clear = createAction('[Courses Filter List] Clear state');
