import { ConclusionHistory } from '../../../models/led-overview';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Led } from '../../../models/led';
import { LedOverviewActions } from '../actions';

export interface LedOverviewState {
  selectedUser: Led;
  isLoading: boolean;
  totalEnrollments: number;
  finishedEnrollments: number;
  conclusionRate: number;
  points: number;
  rank: number;
  conclusionHistory: ConclusionHistory;
}

export const ledOverviewInitialState: LedOverviewState = {
  selectedUser: null,
  isLoading: false,
  totalEnrollments: 0,
  finishedEnrollments: 0,
  conclusionRate: 0,
  points: 0,
  rank: 0,
  conclusionHistory: null,
};

const reducer = createReducer(
  ledOverviewInitialState,
  on(LedOverviewActions.openDialog, (state, { selectedUser }): LedOverviewState => ({ ...state, selectedUser })),
  on(LedOverviewActions.resetState, (): LedOverviewState => ledOverviewInitialState),
);

export const ledOverviewFeature = createFeature({
  name: 'led-overview',
  reducer,
  extraSelectors: ({ selectSelectedUser }) => ({
    selectUserId: createSelector(selectSelectedUser, (user): string => user.id),
  }),
});
