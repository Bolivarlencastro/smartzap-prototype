import { createAction, props } from '@ngrx/store';
import { SummaryModel } from '../../models/panel';

const loadSummary = createAction('[Push Manager - Panel] Load Summary');
const loadSummarySuccess = createAction('[Push Manager - Panel] Load Summary Success', props<{ data: SummaryModel }>());
const loadSummaryFailure = createAction('[Push Manager - Panel] Load Summary Failure');

const openAddCreditsDialog = createAction('[Push Manager - Panel] Open Add Credits Dialog');

export const PanelActions = {
  loadSummary,
  loadSummarySuccess,
  loadSummaryFailure,
  openAddCreditsDialog,
};
