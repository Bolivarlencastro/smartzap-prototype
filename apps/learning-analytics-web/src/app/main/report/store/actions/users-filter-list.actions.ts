import { createAction, props } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';

export const searchItems = createAction(
  '[Users Filter List] Search list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const searchItemsSuccess = createAction(
  '[Users Filter List] Search list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const searchItemsFailure = createAction(
  '[Users Filter List] Search list items failure',
  props<{ error: Error }>(),
);

export const loadFilterItems = createAction(
  '[Users Filter List] Load filter list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const loadFilterItemsSuccess = createAction(
  '[Users Filter List] Load filter list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean }>(),
);

export const loadFilterItemsFailure = createAction(
  '[Users Filter List] Load filter list items failure',
  props<{ error: Error }>(),
);

export const clear = createAction('[Users Filter List] Clear state');
