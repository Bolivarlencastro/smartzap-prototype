import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PanelData, PanelViewModel } from '../../models/panel';
import { PanelActions } from '../actions';

export interface PanelFeatureState {
  data: PanelData;
  loading: boolean;
}

export const panelInitialState: PanelFeatureState = {
  data: null,
  loading: false,
};

const reducer = createReducer(
  panelInitialState,

  on(PanelActions.loadPanelData, (state): PanelFeatureState => ({ ...state, loading: true })),

  on(PanelActions.loadPanelDataSuccess, (state, { data }): PanelFeatureState => ({ ...state, data, loading: false })),

  on(PanelActions.loadPanelDataFailure, (state): PanelFeatureState => ({ ...state, loading: false })),
);

export const panelFeature = createFeature({
  name: 'pm-panel',
  reducer,
  extraSelectors: ({ selectData, selectLoading }) => ({
    selectViewModel: createSelector(selectData, selectLoading, (data, loading): PanelViewModel => ({ data, loading })),
  }),
});
