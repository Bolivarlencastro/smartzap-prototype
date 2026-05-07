import { createAction, props } from '@ngrx/store';
import { LearningTrail, LearningTrailEnrollment } from '../../../model/learning-trail';

export const LOAD_LEARNING_TRAIL = '[LEARNING TRAIL DETAIL] Load learning trail';
export const LOAD_LEARNING_TRAIL_SUCCESS = '[LEARNING TRAIL DETAIL] Load learning trail success';
export const LOAD_LEARNING_TRAIL_ERROR = '[LEARNING TRAIL DETAIL] Load learning trail error';
export const LOAD_LEARNING_TRAIL_RESET = '[LEARNING TRAIL DETAIL] Load learning trail reset';

// Learning Trail
export const loadLearningTrail = createAction(LOAD_LEARNING_TRAIL, props<{ trailId?: string }>());

export const loadLearningTrailSuccess = createAction(LOAD_LEARNING_TRAIL_SUCCESS, props<{ payload: LearningTrail }>());

export const loadLearningTrailFailure = createAction(LOAD_LEARNING_TRAIL_ERROR, props<{ payload: string }>());

// Learning Trail Enroll
export const enrollLearningTrail = createAction(
  '[LEARNING TRAIL DETAIL] Enroll learning trail',
  props<{ learningTrailId: string; userId: string; goalDate: string }>(),
);

export const enrollLearningTrailSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Enroll learning trail success',
  props<{ enrollment: LearningTrailEnrollment }>(),
);

export const enrollLearningTrailFailure = createAction(
  '[LEARNING TRAIL DETAIL] Enroll learning trail failure',
  props<{ payload: string }>(),
);

// Learning Trail Delete
export const deleteLearningTrail = createAction(
  '[LEARNING TRAIL DETAIL] Delete learning trail',
  props<{ id: string }>(),
);

export const deleteLearningTrailSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Delete learning trail success',
  props<{ id: string }>(),
);

export const deleteLearningTrailFailure = createAction(
  '[LEARNING TRAIL DETAIL] Delete learning trail failure',
  props<{ payload: string }>(),
);

// Learning Trail Enroll Give Up
export const enrollGiveUpLearningTrail = createAction(
  '[LEARNING TRAIL DETAIL] Enroll give up learning trail',
  props<{ enrollment_id: string }>(),
);

export const enrollGiveUpLearningTrailSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Enroll give up learning trail success',
);

export const enrollGiveUpLearningTrailFailure = createAction(
  '[LEARNING TRAIL DETAIL] Enroll give up learning trail failure',
  props<{ payload: string }>(),
);

// Learning Trail Enroll Retake
export const enrollRetakeLearningTrail = createAction(
  '[LEARNING TRAIL DETAIL] Enroll retake learning trail',
  props<{ enrollment_id: string; goal_date: string }>(),
);

export const enrollRetakeLearningTrailSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Enroll retake learning trail success',
  props<{ enrollment: LearningTrailEnrollment }>(),
);

export const enrollRetakeLearningTrailFailure = createAction(
  '[LEARNING TRAIL DETAIL] Enroll retake learning trail failure',
  props<{ payload: string }>(),
);

// Learning Trail Enroll Get Certificate
export const enrollGetCertificateLearningTrail = createAction(
  '[LEARNING TRAIL DETAIL] Enroll get certificate learning trail',
  props<{ learning_trail_id: string; user_id: string }>(),
);

export const enrollGetCertificateLearningTrailSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Enroll get certificate learning trail success',
);

export const enrollGetCertificateLearningTrailFailure = createAction(
  '[LEARNING TRAIL DETAIL] Enroll get certificate learning trail failure',
  props<{ payload: string }>(),
);

export const loadLearningTrailReset = createAction(LOAD_LEARNING_TRAIL_RESET);

export const openAttachStepCertificate = createAction(
  '[LEARNING TRAIL DETAIL] Open Attach Step Certificate',
  props<{ id: string }>(),
);

export const generateStepCertificate = createAction(
  '[LEARNING TRAIL DETAIL] Generate Step Certificate',
  props<{ id: string }>(),
);

export const updateLearningTrailDescription = createAction(
  '[Learning Trail Detail] Update learning trail description',
  props<{ id: string; description: string }>(),
);

export const updateLearningTrailDescriptionSuccess = createAction(
  '[LEARNING TRAIL DETAIL] Update LearningTrailDescription Success',
  props<{ description: string }>(),
);

export const updateLearningTrailDescriptionFailure = createAction(
  '[LEARNING TRAIL DETAIL] Update LearningTrailDescription Failure',
  props<{ error: Error }>(),
);
