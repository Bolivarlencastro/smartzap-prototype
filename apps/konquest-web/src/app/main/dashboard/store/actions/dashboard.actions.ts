import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { createAction, props } from '@ngrx/store';

export const loadDashboard = createAction('[Dashboard] Load Dashboard');

export const setDashboardActiveFeatures = createAction(
  '[Dashboard] Set Dashboard Active Features',
  props<{
    missionsActive: boolean;
    trailsActive: boolean;
    pulsesActive: boolean;
    eventsActive: boolean;
  }>(),
);

export const addPulseBookMark = createAction('[Dashboard] Add Pulse Bookmark', props<{ pulse: PulseCardDto }>());

export const addPulseBookmarkSuccess = createAction(
  '[Dashboard] Add Pulse Bookmark Success',
  props<{ payload: PulseCardDto }>(),
);

export const addPulseBookmarkFailure = createAction(
  '[Dashboard] Add Pulse Bookmark Failure',
  props<{ error: Error }>(),
);

export const subscribeToChannel = createAction(
  '[Dashboard] Subscribe To Channel',
  props<{ channel: KpChannelCardModel }>(),
);

export const subscribeToChannelSuccess = createAction(
  '[Dashboard] Subscribe To Channel Success',
  props<{ payload: KpChannelCardModel }>(),
);

export const subscribeToChannelFailure = createAction(
  '[Dashboard] Subscribe To Channel Failure',
  props<{ error: Error }>(),
);

export const unsubscribeFromChannel = createAction(
  '[Dashboard] Unsubscribe from Channel',
  props<{ channel: KpChannelCardModel }>(),
);

export const unsubscribeFromChannelSuccess = createAction(
  '[Dashboard] Unsubscribe from Channel Success',
  props<{ payload: KpChannelCardModel }>(),
);

export const unsubscribeFromChannelFailure = createAction(
  '[Dashboard] Unsubscribe from Channel Failure',
  props<{ error: Error }>(),
);

export const removePulseBookMark = createAction('[Dashboard] Remove Pulse Bookmark', props<{ pulse: PulseCardDto }>());

export const removePulseBookmarkSuccess = createAction(
  '[Dashboard] Remove Pulse Bookmark Success',
  props<{ payload: PulseCardDto }>(),
);

export const removePulseBookmarkFailure = createAction(
  '[Dashboard] Remove Pulse Bookmark Failure',
  props<{ error: Error }>(),
);

export const loadMissionEnrollments = createAction('[Dashboard] Load Mission Enrollments');

export const goToPulse = createAction('[Dashboard] Go To Pulse', props<{ id: any; pulse_type: any }>());

export const goToChannel = createAction('[Dashboard] Go To Channel', props<{ id: any }>());

export const loadMissionEnrollmentsSuccess = createAction(
  '[Dashboard] Load Mission Enrollments Success',
  props<{
    results: LearnContentCardData[];
  }>(),
);
export const loadMissionEnrollmentsFailure = createAction('[Dashboard] Load Mission Enrollments Failure');

export const loadMissionRecommendations = createAction('[Dashboard] Load Mission Recommendations');
export const loadMissionRecommendationsSuccess = createAction(
  '[Dashboard] Load Mission Recommendations Success',
  props<{
    results: LearnContentCardData[];
  }>(),
);
export const loadEvents = createAction('[Dashboard] Load Events');
export const loadEventsSuccess = createAction(
  '[Dashboard] Load Events Success',
  props<{
    results: LearnContentCardData[];
  }>(),
);

export const loadPulses = createAction('[Dashboard] Load Pulses Recommendations');
export const loadPulsesSuccess = createAction(
  '[Dashboard] Load Pulses Recommendations Success',
  props<{
    payload: PulseCardDto[];
  }>(),
);
export const loadPulsesError = createAction('[Dashboard] Load Pulses Error');

export const loadChannels = createAction('[Dashboard] Load Channel Recommendations');

export const loadChannelsSuccess = createAction(
  '[Dashboard] Load Channel Recommendations Success',
  props<{
    payload: KpChannelCardModel[];
  }>(),
);

export const loadChannelsFailure = createAction('[Dashboard] Load Channel Recommendations Failure');

export const loadMissionRecommendationsFailure = createAction('[Dashboard] Load Mission Recommendations Failure');

export const loadTrailRecommendations = createAction('[Dashboard] Load Trail Recommendations');
export const loadTrailRecommendationsSuccess = createAction(
  '[Dashboard] Load Trail Recommendations Success',
  props<{
    results: LearnContentCardData[];
  }>(),
);
export const loadTrailRecommendationsFailure = createAction('[Dashboard] Load Trail Recommendations Failure');

export const loadPriorityMission = createAction('[Dashboard] Load Priority Mission');

export const loadPriorityMissionSuccess = createAction(
  '[Dashboard] Load Priority Mission Success',
  props<{
    result: LearnContentCardData;
  }>(),
);
export const loadPriorityMissionFailure = createAction('[Dashboard] Load Priority Mission Failure');
