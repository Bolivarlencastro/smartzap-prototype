import { Contributor } from '@core/model/contributor.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionActions, MissionContributorsActions } from '../actions';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';

export const contributorsFeatureKey = 'mission-contributors';

export interface MissionContributorsState extends EntityState<Contributor> {
  filteredUsers: User[];
}

export const adapter = createEntityAdapter<Contributor>({ selectId: (item) => item.user.id });

export const initialState: MissionContributorsState = adapter.getInitialState({
  filteredUsers: [],
});

export const contributorsReducer = createReducer(
  initialState,

  on(
    MissionContributorsActions.loadContributorsSuccess,
    (state, { contributors }): MissionContributorsState => adapter.setAll(contributors, state),
  ),

  on(
    MissionContributorsActions.addContributorSuccess,
    (state, { contributor }): MissionContributorsState => adapter.addOne(contributor, state),
  ),

  on(
    MissionContributorsActions.removeContributorSuccess,
    (state, { userId }): MissionContributorsState => adapter.removeOne(userId, state),
  ),

  on(
    MissionContributorsActions.filterUsersSuccess,
    (state, { users }): MissionContributorsState => ({
      ...state,
      filteredUsers: users,
    }),
  ),

  on(MissionActions.resetStore, MissionActions.setMissionModel, (): MissionContributorsState => initialState),
);

export const { selectAll } = adapter.getSelectors();
