import { createAction, props } from '@ngrx/store';
import { OverviewSummary, OverviewTeamSummary } from '../../models/overview';

const init = createAction('[Overview] Init');

const setActivatedServices = createAction(
  '[Overview] Set Activated Services',
  props<{ hasGamification: boolean; hasNormative: boolean }>(),
);

const fetchSummarySuccess = createAction('[Overview] Fetch Summary Success', props<{ summary: OverviewSummary }>());
const fetchSummaryFailure = createAction('[Overview] Fetch Summary Failure');

const fetchTeamSummarySuccess = createAction(
  '[Overview] Fetch Team Summary Success',
  props<{ teamSummary: OverviewTeamSummary }>(),
);
const fetchTeamSummaryFailure = createAction('[Overview] Fetch Team Summary Failure');

export const OverviewActions = {
  init,
  setActivatedServices,
  fetchSummarySuccess,
  fetchSummaryFailure,
  fetchTeamSummarySuccess,
  fetchTeamSummaryFailure,
};
