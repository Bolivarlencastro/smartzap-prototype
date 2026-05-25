import { createFeature, createReducer, on } from '@ngrx/store';
import { SummaryModel } from '../../models/panel';
import { PanelActions } from '../actions';

export interface PanelFeatureState {
  summary: { data: SummaryModel | null; loading: boolean };
}

export const panelInitialState: PanelFeatureState = {
  summary: { data: null, loading: false },
};

const reducer = createReducer(
  panelInitialState,

  on(
    PanelActions.loadSummary,
    (state): PanelFeatureState => ({ ...state, summary: { ...state.summary, loading: true } }),
  ),
  on(
    PanelActions.loadSummarySuccess,
    (state, { data }): PanelFeatureState => ({ ...state, summary: { data, loading: false } }),
  ),
  on(
    PanelActions.loadSummaryFailure,
    (state): PanelFeatureState => ({ ...state, summary: { ...state.summary, loading: false } }),
  ),
);

export const panelFeature = createFeature({
  name: 'pm-panel',
  reducer,
});
