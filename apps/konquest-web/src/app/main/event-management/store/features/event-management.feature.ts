import { Mission, MissionEnrollmentAttendance, MissionModel } from '@app/main/mission/mission.model';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventManagementFilter } from '../../models/filter';
import { EventManagementViewModel } from '../../models/view-model';
import { EventManagementActions } from '../actions';

export interface EventManagementFeatureState {
  eventId: string;
  event: Mission;
  filter: EventManagementFilter;
  users: MissionEnrollmentAttendance[];
  eventLoading: boolean;
  usersLoading: boolean;
}

export const eventManagementInitialState: EventManagementFeatureState = {
  eventId: null,
  event: null,
  filter: { paginate: false },
  users: null,
  eventLoading: false,
  usersLoading: false,
};

export const eventManagementReducer = createReducer(
  eventManagementInitialState,

  on(
    EventManagementActions.init,
    (state, { eventId }): EventManagementFeatureState => ({
      ...state,
      eventId,
      eventLoading: true,
      usersLoading: true,
    }),
  ),

  on(EventManagementActions.loadEvent, (state): EventManagementFeatureState => ({ ...state, eventLoading: true })),
  on(EventManagementActions.loadEventSuccess, (state, { event }): EventManagementFeatureState => {
    if (state.filter.date_id) {
      return { ...state, event, eventLoading: false };
    }

    return { ...state, event, filter: { ...state.filter, date_id: getDateIdDefault(event) }, eventLoading: false };
  }),
  on(
    EventManagementActions.loadEventFailure,
    (state): EventManagementFeatureState => ({ ...state, eventLoading: false }),
  ),

  on(EventManagementActions.loadUsers, (state): EventManagementFeatureState => ({ ...state, usersLoading: true })),
  on(
    EventManagementActions.loadUsersSuccess,
    (state, { users }): EventManagementFeatureState => ({ ...state, users, usersLoading: false }),
  ),
  on(
    EventManagementActions.loadUsersFailure,
    (state): EventManagementFeatureState => ({ ...state, usersLoading: false }),
  ),

  on(
    EventManagementActions.setFilter,
    (state, { filter }): EventManagementFeatureState => ({
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    }),
  ),

  on(EventManagementActions.reset, (): EventManagementFeatureState => eventManagementInitialState),
);

export const eventManagementFeature = createFeature({
  name: 'eventManagement',
  reducer: eventManagementReducer,
  extraSelectors: ({ selectEventLoading, selectUsersLoading, selectEvent, selectFilter, selectUsers }) => ({
    selectViewModel: createSelector(
      selectEventLoading,
      selectUsersLoading,
      selectEvent,
      selectFilter,
      selectUsers,
      (eventLoading, usersLoading, event, filter, users): EventManagementViewModel => {
        const model = event?.mission_model === MissionModel.PRESENTIAL ? 'presential' : 'live';

        return {
          eventLoading,
          usersLoading,
          event,
          filter,
          dateFilterOptions: event?.[model].dates,
          users,
        };
      },
    ),
    selectEventDates: createSelector(selectEvent, (event) => {
      const model = event?.mission_model === MissionModel.PRESENTIAL ? 'presential' : 'live';
      return event?.[model].dates;
    }),
    selectCurrentDateId: createSelector(selectFilter, (filter) => filter.date_id),
    selectIsFinished: createSelector(selectEvent, (event) => event?.development_status === DevelopmentStatus.CLOSED),
  }),
});

function getDateIdDefault(event: Mission): string {
  const model = event.mission_model === MissionModel.PRESENTIAL ? 'presential' : 'live';
  return event?.[model].dates?.[0]?.id;
}
