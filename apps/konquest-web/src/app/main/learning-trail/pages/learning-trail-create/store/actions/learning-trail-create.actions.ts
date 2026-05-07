import { LearningTrail, TrailLearnContent } from '@app/main/learning-trail/model/learning-trail';

import { createAction, props } from '@ngrx/store';
import {
  LearningTrailImageType,
  LearningTrailImageUpload,
} from '../../containers/learning-trail-images/learning-trail-images.component';

export const saveLearningTrail = createAction(
  '[CREATE LEARNING TRAIL] Save Learning Trail',
  props<{ learningTrail: Partial<LearningTrail>; skipNavigation?: boolean }>(),
);

export const saveLearningTrailSuccess = createAction(
  '[CREATE LEARNING TRAIL] Save Learning Trail Success',
  props<{ learningTrail: Partial<LearningTrail>; firstSave: boolean; skipNavigation?: boolean }>(),
);

export const saveLearningTrailFailure = createAction(
  '[CREATE LEARNING TRAIL] Save Learning Trial Failure',
  props<{ error: Error }>(),
);

export const updateLearningTrailWithImageSuccess = createAction(
  '[CREATE LEARNING TRAIL] Update learning Image trail Success',
  props<{ learningTrail: LearningTrail }>(),
);

export const updateLearningTrailFailure = createAction(
  '[CREATE LEARNING TRAIL] Update learning trail Failure',
  props<{ error: Error }>(),
);

export const loadLearningTrail = createAction(
  '[CREATE LEARNING TRAIL] Load learning trail',
  props<{ id: string | undefined }>(),
);

export const postLearningTrailContent = createAction(
  '[CREATE LEARNING TRAIL] Post learning trail content',
  props<{
    learning_trail: string;
    mission?: string;
    pulse?: string;
    order: number;
  }>(),
);

export const postLearningTrailContentSuccess = createAction(
  '[CREATE LEARNING TRAIL] Post learning trail content Success',
  props<{ learningTrailId: string; content?: any }>(),
);

export const postLearningTrailContentFailure = createAction(
  '[CREATE LEARNING TRAIL] Post learning trail content Failure',
  props<{ error: Error }>(),
);

export const updateLearningTrailContent = createAction(
  '[CREATE LEARNING TRAIL] Update learning trail content',
  props<{ steps: { step_id: string; order: number }[] }>(),
);

export const updateLearningTrailContentSuccess = createAction(
  '[CREATE LEARNING TRAIL] Update learning trail content Success',
  props<{ content?: any }>(),
);

export const loadContents = createAction(
  '[CREATE LEARNING TRAIL] Load learning trails contents',
  props<{ search: string }>(),
);

export const loadContentsSuccess = createAction(
  '[CREATE LEARNING TRAIL] Load learning trails contents Success',
  props<{ contents: TrailLearnContent[] }>(),
);

export const loadContentsFailure = createAction(
  '[CREATE LEARNING TRAIL] Load learning trails contents Failure',
  props<{ error: Error }>(),
);

export const deleteLearningTrailContentFailure = createAction(
  '[CREATE LEARNING TRAIL] Delete learning trails contents Failure',
  props<{ error: Error }>(),
);

export const deleteLearningTrailContent = createAction(
  '[CREATE LEARNING TRAIL] Delete learning trails contents',
  props<{ learningTrailId: string; id: any }>(),
);

export const deleteLearningTrailContentSuccess = createAction(
  '[CREATE LEARNING TRAIL] Delete learning trails contents Success',
  props<{ learningTrailId: string; payload?: any }>(),
);

export const postLearningTrailImage = createAction(
  '[CREATE LEARNING TRAIL] Post learning trail image',
  props<{ imageDefinition: LearningTrailImageUpload }>(),
);

export const postLearningTrailImageSuccess = createAction(
  '[CREATE LEARNING TRAIL] Post learning trail image Success',
  props<{ url: string; imageType: LearningTrailImageType }>(),
);

export const loadLearningTrailSuccess = createAction(
  '[CREATE LEARNING TRAIL] Load learning trail Success',
  props<{ learningTrail: LearningTrail }>(),
);

export const loadLearningTrailFailure = createAction(
  '[CREATE LEARNING TRAIL] Load learning trail Failure',
  props<{ payload: string }>(),
);

export const updateTrailImage = createAction(
  '[CREATE LEARNING TRAIL] Update Learning Trail Image',
  props<{
    file: File;
    imageType: LearningTrailImageType;
    rootImage: File | string;
    uploadImageType: 'banner' | 'card';
  }>(),
);

export const updateTrailImageSuccess = createAction(
  '[CREATE LEARNING TRAIL] Update Learning Trail Image Success',
  props<{ url: string; imageType: LearningTrailImageType }>(),
);

export const updateTrailImageFailure = createAction(
  '[CREATE LEARNING TRAIL] Update Learning Trail Image Failure',
  props<{ error: any }>(),
);

export const navigateToTrail = createAction('[CREATE LEARNING TRAIL] Navigate to Learning Trail');

export const nextStep = createAction('[CREATE LEARNING TRAIL] Navigate to Next Step');

export const previousStep = createAction('[CREATE LEARNING TRAIL] Navigate to Previous Step');

export const clearCache = createAction('[CREATE LEARNING TRAIL] Clear Cache');

export const resetStore = createAction('[CREATE LEARNING TRAIL] Reset Store');

export const openImageGenerationDialog = createAction(
  '[CREATE LEARNING TRAIL] Open Image Generation Dialog',
  props<{ uploadImageType: 'banner' | 'card'; rootImage?: File | string }>(),
);
