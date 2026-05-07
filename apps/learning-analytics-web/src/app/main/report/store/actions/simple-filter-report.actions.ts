import { createAction, props } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';

export const searchItems = createAction(
  '[Simple Filter Report Dialog] Search list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const searchItemsSuccess = createAction(
  '[Simple Filter Report Dialog] Search list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean; count: number }>(),
);

export const searchItemsFailure = createAction(
  '[Simple Filter Report Dialog] Search list items failure',
  props<{ error: Error }>(),
);

export const loadFilterItems = createAction(
  '[Simple Filter Report Dialog] Load filter list items',
  props<{ filter: SimpleFilterReportModel }>(),
);

export const loadFilterItemsSuccess = createAction(
  '[Simple Filter Report Dialog] Load filter list items success',
  props<{ items: SimpleFilterListItem[]; loaded: boolean; count: number }>(),
);

export const loadFilterItemsFailure = createAction(
  '[Simple Filter Report Dialog] Load filter list items failure',
  props<{ error: Error }>(),
);

export const fetchMoreItems = createAction('[Simple Filter Report Dialog] Load fetch more itens');

export const clear = createAction('[Simple Filter Report Dialog] Clear state');
