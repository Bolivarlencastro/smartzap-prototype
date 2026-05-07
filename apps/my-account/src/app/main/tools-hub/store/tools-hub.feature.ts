import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ToolsHubActions } from '.';

export interface ToolsHubFeatureState {
  items: CustomMenuItem[];
  loading: boolean;
}

export const toolsHubInitialState: ToolsHubFeatureState = {
  items: [],
  loading: true,
};

export const toolsHubReducer = createReducer(
  toolsHubInitialState,

  on(
    ToolsHubActions.loadData,
    ToolsHubActions.create,
    ToolsHubActions.edit,
    ToolsHubActions.remove,
    (state): ToolsHubFeatureState => ({ ...state, loading: true }),
  ),

  on(
    ToolsHubActions.loadDataFailure,
    ToolsHubActions.createFailure,
    ToolsHubActions.editFailure,
    ToolsHubActions.removeFailure,
    (state): ToolsHubFeatureState => ({ ...state, loading: false }),
  ),

  on(
    ToolsHubActions.loadDataSuccess,
    (state, { items }): ToolsHubFeatureState => ({ ...state, items, loading: false }),
  ),

  on(ToolsHubActions.reset, (): ToolsHubFeatureState => toolsHubInitialState),
);

export const toolsHubFeature = createFeature({
  name: 'toolsHub',
  reducer: toolsHubReducer,
});
