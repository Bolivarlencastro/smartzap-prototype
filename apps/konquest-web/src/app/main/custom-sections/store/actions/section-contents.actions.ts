import { createAction, props } from '@ngrx/store';
import { CustomSectionModel, LearningObjectType } from '../../models/custom-sections';
import { ContentModel, ContentTabType } from '../../models/section-contents';

export const init = createAction('[Section Contents] Init', props<{ learningObjectType: LearningObjectType }>());

export const loadData = createAction('[Section Contents] Load Data');

export const setData = createAction('[Section Contents] Set Data', props<{ items: ContentModel[] }>());

export const setSearch = createAction('[Section Contents] Set Search', props<{ search: string }>());

export const setTab = createAction('[Section Contents] Set Tab', props<{ tab: ContentTabType }>());

export const save = createAction('[Section Contents] Save', props<{ section: CustomSectionModel; ids: string[] }>());
export const saveSuccess = createAction('[Section Contents] Save Success', props<{ message: string }>());
export const saveFailure = createAction('[Section Contents] Save Failure', props<{ message: string }>());

export const reset = createAction('[Section Contents] Reset');
