import { createAction, props } from '@ngrx/store';
import { JobEnum, JobModel } from '../models';

export const loadItems = createAction('[Job Management] Load Items');
export const loadItemsSuccess = createAction('[Job Management] Load Items Success', props<{ response: JobModel[] }>());
export const loadItemsFailure = createAction('[Job Management] Load Items Failure');

export const deleteItem = createAction('[Job Management] Delete Item', props<{ id: string | string[] }>());

export const openDialog = createAction('[Job Management] Open Dialog', props<{ item?: JobModel }>());
export const dialogClosed = createAction('[Job Management] Dialog Closed');

export const saveItem = createAction('[Job Management] Save Item', props<{ response: JobModel }>());

export const createItem = createAction(
  '[Job Management] Create Item',
  props<{ jobType: JobEnum; response: JobModel }>(),
);

export const editItem = createAction('[Job Management] Edit Item', props<{ jobType: JobEnum; response: JobModel }>());

export const changeTab = createAction('[Job Management] Change Tab', props<{ tab: JobEnum }>());

export const updateSearchTerm = createAction('[Job Management] Update Search Term', props<{ searchTerm: string }>());

export const resetState = createAction('[Job Management] Reset State');
