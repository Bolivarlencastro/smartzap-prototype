import { createAction, props } from '@ngrx/store';
import { GroupLearningTrailActionData } from '../group-learning-trail.model';

export const loadGroupLearningTrails = createAction(
  '[GroupLearningTrail] Load Group Learning Trails',
  props<{ id: string; queryParams?: any }>(),
);

export const filterGroupLearningTrails = createAction(
  '[GroupLearningTrail] Filter Group Learning Trails',
  props<{ id: string; queryParams?: any }>(),
);

export const loadGroupLearningTrailsSuccess = createAction(
  '[GroupLearningTrail] Load Group Learning Trails Success',
  props<{ data: any }>(),
);

export const loadGroupLearningTrailsFailure = createAction(
  '[GroupLearningTrail] Load Group Learning Trails Failure',
  props<{ error: Error }>(),
);

export const addGroupLearningTrails = createAction(
  '[GroupLearningTrail/API] Add Group Learning Trails',
  props<{ data: GroupLearningTrailActionData }>(),
);

export const deleteGroupLearningTrail = createAction(
  '[GroupLearningTrail/API] Delete Group Learning Trail',
  props<{ id: string; groupId: string; learningTrailId: string }>(),
);

export const deleteGroupLearningTrailSuccess = createAction(
  '[GroupLearningTrail/API] Delete Group Learning Trail Success',
);

export const clearCache = createAction('[GroupLearningTrail/API] Clear Group Learning Trails');
