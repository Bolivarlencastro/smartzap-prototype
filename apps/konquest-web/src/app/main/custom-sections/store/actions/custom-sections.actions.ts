import { createAction, props } from '@ngrx/store';
import {
  CustomSectionModel,
  CustomSectionsFeature,
  DeleteContentModel,
  LearningObjectType,
  PageType,
} from '../../models/custom-sections';

export const init = createAction('[Custom Sections] Init');

export const setActiveFeatures = createAction(
  '[Custom Sections] Set Active Features',
  props<{ activeFeatures: CustomSectionsFeature[] }>(),
);

export const setSections = createAction('[Custom Sections] Set Sections', props<{ sections: any }>());

export const changePage = createAction('[Custom Sections] Change Page', props<{ pageType: PageType }>());

export const openSectionCreationDialog = createAction(
  '[Custom Sections] Open Section Creation Dialog',
  props<{ id: LearningObjectType }>(),
);

export const createSection = createAction(
  '[Custom Sections] Create Section',
  props<{ id: LearningObjectType; data: CustomSectionModel }>(),
);
export const createSectionSuccess = createAction(
  '[Custom Sections] Create Section Success',
  props<{ message: string }>(),
);
export const createSectionFailure = createAction(
  '[Custom Sections] Create Section Failure',
  props<{ message: string }>(),
);

export const openSectionEditionDialog = createAction(
  '[Custom Sections] Open Section Edition Dialog',
  props<{ data: CustomSectionModel }>(),
);

export const editSection = createAction('[Custom Sections] Edit Section', props<{ data: CustomSectionModel }>());
export const editSectionSuccess = createAction('[Custom Sections] Edit Section Success', props<{ message: string }>());
export const editSectionFailure = createAction('[Custom Sections] Edit Section Failure', props<{ message: string }>());

export const openDeleteSectionDialog = createAction(
  '[Custom Sections] Open Delete Section Dialog',
  props<{ id: string }>(),
);

export const deleteSection = createAction('[Custom Sections] Delete Section', props<{ id: string }>());
export const deleteSectionSuccess = createAction(
  '[Custom Sections] Delete Section Success',
  props<{ message: string }>(),
);
export const deleteSectionFailure = createAction(
  '[Custom Sections] Delete Section Failure',
  props<{ message: string }>(),
);

export const deleteContent = createAction('[Custom Sections] Delete Content', props<{ data: DeleteContentModel }>());
export const deleteContentSuccess = createAction(
  '[Custom Sections] Delete Content Success',
  props<{ message: string }>(),
);
export const deleteContentFailure = createAction(
  '[Custom Sections] Delete Content Failure',
  props<{ message: string }>(),
);

export const reorderSections = createAction('[Custom Sections] Reorder Sections', props<{ ids: string[] }>());

export const reset = createAction('[Custom Sections] Reset');
