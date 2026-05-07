import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[Tools Hub] Load Data');
export const loadDataSuccess = createAction('[Tools Hub] Load Data Success', props<{ items: CustomMenuItem[] }>());
export const loadDataFailure = createAction('[Tools Hub] Load Data Failure');

export const openConfigDialog = createAction('[Tools Hub] Open Config Dialog', props<{ item?: CustomMenuItem }>());

export const create = createAction('[Tools Hub] Create', props<{ data: Partial<CustomMenuItem> }>());
export const createSuccess = createAction('[Tools Hub] Create Success', props<{ message: string }>());
export const createFailure = createAction('[Tools Hub] Create Failure', props<{ message: string }>());

export const edit = createAction('[Tools Hub] Edit', props<{ data: Partial<CustomMenuItem> }>());
export const editSuccess = createAction('[Tools Hub] Edit Success', props<{ message: string }>());
export const editFailure = createAction('[Tools Hub] Edit Failure', props<{ message: string }>());

export const remove = createAction('[Tools Hub] Remove', props<{ id: string }>());
export const removeSuccess = createAction('[Tools Hub] Remove Success', props<{ message: string }>());
export const removeFailure = createAction('[Tools Hub] Remove Failure', props<{ message: string }>());

export const reset = createAction('[Tools Hub] Reset');
