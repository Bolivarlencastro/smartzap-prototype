import { ROLE_OPTIONS, STATUS_OPTIONS, UserSearchFilterOption } from '@app/shared/model';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UserFilterLists } from '../../users.types';
import { UsersListFilterActions } from '../actions';

export interface UsersListFilterFeatureState {
  jobPositions: UserSearchFilterOption[];
  leaders: UserSearchFilterOption[];
  activityAreas: string[];
  directors: string[];
  managers: string[];
}

export const usersListFilterInitialState: UsersListFilterFeatureState = {
  jobPositions: [],
  activityAreas: [],
  directors: [],
  managers: [],
  leaders: [],
};

export const usersListFilterReducer = createReducer(
  usersListFilterInitialState,

  on(
    UsersListFilterActions.fetchJobPositions,
    (state, { jobPositions }): UsersListFilterFeatureState => ({
      ...state,
      jobPositions,
    }),
  ),

  on(
    UsersListFilterActions.fetchLeaders,
    (state, { leaders }): UsersListFilterFeatureState => ({
      ...state,
      leaders,
    }),
  ),

  on(
    UsersListFilterActions.fetchActivityAreas,
    (state, { activityAreas }): UsersListFilterFeatureState => ({
      ...state,
      activityAreas,
    }),
  ),

  on(
    UsersListFilterActions.fetchDirectors,
    (state, { directors }): UsersListFilterFeatureState => ({
      ...state,
      directors,
    }),
  ),

  on(
    UsersListFilterActions.fetchManagers,
    (state, { managers }): UsersListFilterFeatureState => ({
      ...state,
      managers,
    }),
  ),

  on(UsersListFilterActions.clear, (): UsersListFilterFeatureState => usersListFilterInitialState),
);

export const usersListFilterFeature = createFeature({
  name: 'usersListFilter',
  reducer: usersListFilterReducer,
  extraSelectors: ({ selectJobPositions, selectActivityAreas, selectDirectors, selectManagers, selectLeaders }) => ({
    selectFilterLists: createSelector(
      selectJobPositions,
      selectActivityAreas,
      selectDirectors,
      selectManagers,
      selectLeaders,
      (jobPositions, activityAreas, directors, managers, leaders): UserFilterLists => ({
        jobPositions,
        activityAreas,
        directors,
        managers,
        leaders,
        roles: ROLE_OPTIONS,
        statuses: STATUS_OPTIONS,
      }),
    ),
  }),
});
