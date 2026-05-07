import { User } from '@core/model';
import { Contributor } from '@core/model/contributor.model';
import { Action, createReducer, on } from '@ngrx/store';

import { MissionDetailContributorActions } from '../actions';

export const featureKey = 'featureContributors';

export interface State {
  loading: boolean;
  contributors: Contributor[];
  users: User[];
  error: string;
}

export const initialState: State = {
  contributors: [],
  users: [],
  loading: false,
  error: '',
};

const reducers = createReducer(
  initialState,

  on(
    MissionDetailContributorActions.getMissionContributor,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    MissionDetailContributorActions.getMissionContributorSuccess,
    (state, { contributors }): State => ({
      ...state,
      contributors,
      loading: false,
    }),
  ),
  on(
    MissionDetailContributorActions.getMissionContributorFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),

  on(
    MissionDetailContributorActions.deleteMissionContributor,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    MissionDetailContributorActions.deleteMissionContributorSuccess,
    (state): State => ({
      ...state,
      loading: false,
    }),
  ),
  on(
    MissionDetailContributorActions.deleteMissionContributorFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),

  on(
    MissionDetailContributorActions.addMissionContributor,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    MissionDetailContributorActions.addMissionContributorSuccess,
    (state, { contributors }): State => ({
      ...state,
      contributors,
      loading: false,
    }),
  ),
  on(
    MissionDetailContributorActions.addMissionContributorFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),

  on(
    MissionDetailContributorActions.getUsers,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    MissionDetailContributorActions.getUsersSuccess,
    (state, { users }): State => ({
      ...state,
      users,
      loading: false,
    }),
  ),
  on(
    MissionDetailContributorActions.getUsersFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),

  on(
    MissionDetailContributorActions.cleanCache,
    (_): State => ({
      ...initialState,
    }),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return reducers(state, action);
}
