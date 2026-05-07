import { CMI } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CourseActions, ScormCMIActions } from '../actions';

export const classroomScomCMIFeatureKey = 'classroomScormCMI';

export type ScormCmiState = {
  loading: boolean;
  cmi: CMI | null;
  lastEmittedCMI: CMI | null;
};

export const scormInitialState: ScormCmiState = {
  loading: true,
  cmi: null,
  lastEmittedCMI: null,
};

const reducer = createReducer(
  scormInitialState,
  on(ScormCMIActions.loadScormCMI, (): ScormCmiState => scormInitialState),

  on(
    ScormCMIActions.loadScormCMISuccess,
    (_state, { cmi }): ScormCmiState => ({
      loading: false,
      cmi,
      lastEmittedCMI: null,
    }),
  ),

  on(ScormCMIActions.storeLastEmittedScormCMI, (state, { cmi }): ScormCmiState => ({ ...state, lastEmittedCMI: cmi })),

  on(CourseActions.reset, (): ScormCmiState => scormInitialState),
);

export const classroomScormFeature = createFeature({
  name: classroomScomCMIFeatureKey,
  reducer,
});
