import { createAction, props } from '@ngrx/store';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const fetchNormativeModule = createAction('[Normative Cycles] Fetch Normative Module');

export const fetchNormativeModuleSuccess = createAction(
  '[Normative Cycles] Fetch Normative Module Success',
  props<{ isNormativeActive: boolean }>(),
);

export const filterCycles = createAction('[Normative Cycles] Apply Filter', props<{ search: string }>());

export const filterCyclesSuccess = createAction(
  '[Normative Cycles] On Filter Success',
  props<{ results: CycleDto[] }>(),
);

export const filterCyclesFailure = createAction('[Normative Cycles] On Filter Failure');

export const reset = createAction('[Normative Cycles] Reset');
