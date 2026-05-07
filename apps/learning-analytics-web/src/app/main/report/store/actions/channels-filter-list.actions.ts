import { createAction, props } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';

export const searchItems = createAction(
  '[Channels Filter List] Search list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const searchItemsSuccess = createAction(
  '[Channels Filter List] Search list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const searchItemsFailure = createAction(
  '[Channels Filter List] Search list items failure',
  props<{ error: Error }>(),
);

export const loadFilterItems = createAction(
  '[Channels Filter List] Load filter list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const loadFilterItemsSuccess = createAction(
  '[Channels Filter List] Load filter list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const loadFilterItemsFailure = createAction(
  '[Channels Filter List] Load filter list items failure',
  props<{ error: Error }>(),
);

export const clear = createAction('[Channels Filter List] Clear state');
