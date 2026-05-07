import { createAction, props } from '@ngrx/store';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openDialog = createAction('[Link Enrollment To Cycle] Open Dialog', props<{ enrollmentId: string }>());

export const dialogClosed = createAction('[Link Enrollment To Cycle] Dialog Closed');

export const linkCycle = createAction(
  '[Link Enrollment To Cycle] Link Enrollment To Cycle',
  props<{
    cycleId: string;
  }>(),
);

export const linkCycleSuccess = createAction('[Link Enrollment To Cycle] Link Enrollment To Cycle Success');

export const linkCycleFailure = createAction('[Link Enrollment To Cycle] Link Enrollment To Cycle Failure');

export const filterCycles = createAction('[Link Enrollment To Cycle] Filter Cycles', props<{ filter: string }>());

export const filterCyclesSuccess = createAction(
  '[Link Enrollment To Cycle] Filter Cycles Success',
  props<{
    cycles: CycleDto[];
  }>(),
);

export const filterCyclesFailure = createAction('[Link Enrollment To Cycle] Filter Cycles Failure');

export const resetState = createAction('[Link Enrollment To Cycle] Reset State');
