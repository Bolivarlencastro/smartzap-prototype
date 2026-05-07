import { createAction, props } from '@ngrx/store';
import { LearningTrailFilter, LearningTrailListPayload } from 'app/main/learning-trail/model/learning-trail';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';

export const loadInitialData = createAction('[LEARNING TRAILS COLLECTION] Load Initial Data');

export const loadLearningTrails = createAction('[LEARNING TRAILS COLLECTION] Load Learning Trails');

export const loadLearningTrailsSuccess = createAction(
  '[LEARNING TRAILS COLLECTION] Load Learning Trails Success',
  props<{ payload: LearningTrailListPayload }>(),
);

export const loadLearningTrailsFailure = createAction(
  '[LEARNING TRAILS COLLECTION] Load Learning Trails Failure',
  props<{ error: Error }>(),
);

export const fetchMoreLearningTrails = createAction('[LEARNING TRAILS COLLECTION] Fetch More Learning Trails');

export const fetchMoreLearningTrailsSuccess = createAction(
  '[LEARNING TRAILS COLLECTION] Fetch More Learning Trails Success',
  props<{ payload: LearningTrailListPayload }>(),
);

export const fetchMoreLearningTrailsFailure = createAction(
  '[LEARNING TRAILS COLLECTION] Fetch More Learning Trails Failure',
  props<{ error: Error }>(),
);

export const filterLearningTrails = createAction(
  '[LEARNING TRAILS COLLECTION] Filter Learning Trails',
  props<{ filter: LearningTrailFilter; newQuickFilterType?: QuickFilterType }>(),
);

export const openDetailDialog = createAction(
  '[LEARNING TRAILS COLLECTION] Open Detail Dialog',
  props<{ trailId: string }>(),
);

export const removeTrail = createAction('[LEARNING TRAILS COLLECTION] Remove Trail', props<{ trailId: string }>());

export const resetCollectionState = createAction('[LEARNING TRAILS COLLECTION] Reset Learning Trails Collection');
