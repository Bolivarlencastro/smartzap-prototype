import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { DashboardActions } from './actions';
import { DashboardViewModel } from 'app/main/dashboard/models';
import { LearnContentActions } from 'app/shared/store';
import {
  toggleBookmarkAction,
  updateChannelSubscription,
  updateLearnContentBookmarkInGroup,
  updatePulseBookmark,
} from 'app/shared/utils/card-helpers';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';

export interface DashboardFeatureState {
  loadingPriorityMission: boolean;
  loadingMissionEnrollments: boolean;
  loadingMissionRecommendations: boolean;
  loadingTrailRecommendations: boolean;
  loadingEvents: boolean;
  loadingPulses: boolean;
  loadingChannel: boolean;

  priorityMission: LearnContentCardData[];
  missionEnrollments: LearnContentCardData[];
  missionRecommendations: LearnContentCardData[];
  trailRecommendations: LearnContentCardData[];
  events: LearnContentCardData[];
  pulses: PulseCardDto[];
  channels: KpChannelCardModel[];

  missionsActive: boolean;
  trailsActive: boolean;
  pulsesActive: boolean;
  eventsActive: boolean;
}

const dashboardFeatureInitialState: DashboardFeatureState = {
  loadingPriorityMission: true,
  loadingMissionEnrollments: true,
  loadingMissionRecommendations: true,
  loadingTrailRecommendations: true,
  loadingEvents: true,
  loadingPulses: true,
  loadingChannel: true,
  priorityMission: [],
  missionEnrollments: [],
  missionRecommendations: [],
  trailRecommendations: [],
  events: [],
  pulses: [],
  channels: [],
  missionsActive: false,
  trailsActive: false,
  pulsesActive: false,
  eventsActive: false,
};

const reducer = createReducer(
  dashboardFeatureInitialState,
  on(
    DashboardActions.setDashboardActiveFeatures,
    (state, { missionsActive, pulsesActive, trailsActive, eventsActive }): DashboardFeatureState => ({
      ...state,
      missionsActive,
      pulsesActive,
      trailsActive,
      eventsActive,
    }),
  ),
  on(
    DashboardActions.loadMissionEnrollments,
    (state): DashboardFeatureState => ({ ...state, loadingMissionEnrollments: true }),
  ),
  on(
    DashboardActions.loadMissionEnrollmentsSuccess,
    (state, { results }): DashboardFeatureState => ({
      ...state,
      loadingMissionEnrollments: false,
      missionEnrollments: results,
    }),
  ),

  on(
    DashboardActions.loadMissionRecommendations,
    (state): DashboardFeatureState => ({ ...state, loadingMissionRecommendations: true }),
  ),
  on(
    DashboardActions.loadMissionRecommendationsSuccess,
    (state, { results }): DashboardFeatureState => ({
      ...state,
      loadingMissionRecommendations: false,
      missionRecommendations: results,
    }),
  ),

  on(DashboardActions.loadEvents, (state): DashboardFeatureState => ({ ...state, loadingEvents: true })),
  on(
    DashboardActions.loadEventsSuccess,
    (state, { results }): DashboardFeatureState => ({
      ...state,
      loadingEvents: false,
      events: results,
    }),
  ),

  on(DashboardActions.loadPulses, (state): DashboardFeatureState => ({ ...state, loadingPulses: true })),
  on(
    DashboardActions.loadPulsesSuccess,
    (state, { payload }): DashboardFeatureState => ({
      ...state,
      loadingPulses: false,
      pulses: payload,
    }),
  ),

  on(DashboardActions.loadChannels, (state): DashboardFeatureState => ({ ...state, loadingChannel: true })),
  on(
    DashboardActions.loadChannelsSuccess,
    (state, { payload }): DashboardFeatureState => ({
      ...state,
      loadingChannel: false,
      channels: payload,
    }),
  ),
  on(
    DashboardActions.addPulseBookmarkSuccess,
    DashboardActions.removePulseBookmarkSuccess,
    (state, { payload }): DashboardFeatureState => {
      return { ...state, pulses: updatePulseBookmark(state.pulses, payload) };
    },
  ),
  on(
    DashboardActions.subscribeToChannelSuccess,
    DashboardActions.unsubscribeFromChannelSuccess,
    (state, { payload }): DashboardFeatureState => {
      return { ...state, channels: updateChannelSubscription(state.channels, payload) };
    },
  ),
  on(
    DashboardActions.loadTrailRecommendations,
    (state): DashboardFeatureState => ({ ...state, loadingTrailRecommendations: true }),
  ),
  on(
    DashboardActions.loadTrailRecommendationsSuccess,
    (state, { results }): DashboardFeatureState => ({
      ...state,
      loadingTrailRecommendations: false,
      trailRecommendations: results,
    }),
  ),

  on(
    DashboardActions.loadPriorityMission,
    (state): DashboardFeatureState => ({ ...state, loadingPriorityMission: true }),
  ),
  on(
    DashboardActions.loadPriorityMissionSuccess,
    (state, { result }): DashboardFeatureState => ({
      ...state,
      loadingPriorityMission: false,
      priorityMission: [result],
    }),
  ),

  on(LearnContentActions.enrollSuccess, (state, { learnContentAction }): DashboardFeatureState => {
    return {
      ...state,
      missionRecommendations: state.missionRecommendations.filter(
        (item) => item.contentId !== learnContentAction.learnContent.contentId,
      ),
      loadingPriorityMission: true,
    };
  }),

  on(LearnContentActions.addBookmarkSuccess, (state, { learnContent, bookmarkId }): DashboardFeatureState => {
    const updatedLearnContent: LearnContentCardData = {
      ...learnContent,
      bookmarkId,
      actions: toggleBookmarkAction(learnContent.actions, 'add-bookmark', 'remove-bookmark'),
    };

    return {
      ...state,
      priorityMission: updateLearnContentBookmarkInGroup(state.priorityMission, updatedLearnContent),
      missionRecommendations: updateLearnContentBookmarkInGroup(state.missionRecommendations, updatedLearnContent),
      events: updateLearnContentBookmarkInGroup(state.events, updatedLearnContent),
    };
  }),

  on(LearnContentActions.removeBookmarkSuccess, (state, { learnContent }): DashboardFeatureState => {
    const updatedLearnContent: LearnContentCardData = {
      ...learnContent,
      bookmarkId: undefined,
      actions: toggleBookmarkAction(learnContent.actions, 'remove-bookmark', 'add-bookmark'),
    };

    return {
      ...state,
      priorityMission: updateLearnContentBookmarkInGroup(state.priorityMission, updatedLearnContent),
      missionRecommendations: updateLearnContentBookmarkInGroup(state.missionRecommendations, updatedLearnContent),
      events: updateLearnContentBookmarkInGroup(state.events, updatedLearnContent),
    };
  }),
);

export const dashboardFeature = createFeature({
  name: 'dashboardV2',
  reducer,
  extraSelectors: ({ selectDashboardV2State }) => ({
    selectViewModel: createSelector(
      selectDashboardV2State,
      (state): DashboardViewModel => ({
        ...state,
      }),
    ),
  }),
});
