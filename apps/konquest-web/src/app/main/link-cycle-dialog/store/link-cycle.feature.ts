import { createFeature, createReducer, on } from '@ngrx/store';
import { LinkCycleActions } from '.';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface LinkCycleState {
  enrollmentId: string | undefined;
  cycles: CycleDto[];
}

export const linkCycleInitialState: LinkCycleState = {
  enrollmentId: undefined,
  cycles: [],
};

export const linkCycleReducer = createReducer(
  linkCycleInitialState,

  on(LinkCycleActions.openDialog, (state, { enrollmentId }): LinkCycleState => {
    return { ...state, enrollmentId };
  }),

  on(LinkCycleActions.filterCyclesSuccess, (state, { cycles }): LinkCycleState => {
    return { ...state, cycles };
  }),

  on(LinkCycleActions.resetState, (): LinkCycleState => linkCycleInitialState),
);

export const linkCycleFeature = createFeature({
  name: 'linkCycle',
  reducer: linkCycleReducer,
});
