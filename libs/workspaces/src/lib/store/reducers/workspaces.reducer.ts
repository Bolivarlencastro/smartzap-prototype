import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { WorkspacesActions } from '../actions';
import { WorkspaceViewMode } from '../models/workspaces.model';

export const workspacesFeatureKey = 'workspaces-feature';

export interface WorkspacesState extends EntityState<WorkspaceBasicDto> {
  loading: boolean;
  viewMode: WorkspaceViewMode;
  canUseListView: boolean;
}

export const adapter = createEntityAdapter<WorkspaceBasicDto>();

export const initialState: WorkspacesState = adapter.getInitialState({
  loading: false,
  viewMode: 'grid',
  canUseListView: false,
});

export const reducer = createReducer(
  initialState,

  on(WorkspacesActions.loadWorkspaces, (state) => ({ ...state, loading: true })),

  on(WorkspacesActions.loadWorkspacesSuccess, (state, { results }) =>
    adapter.setAll(results, {
      ...state,
      loading: false,
    }),
  ),

  on(WorkspacesActions.loadWorkspacesFailure, (state) => ({ ...state, loading: false })),

  on(WorkspacesActions.setViewMode, (state, { viewMode }) => {
    if (!state.canUseListView && viewMode === 'list') {
      return { ...state, viewMode: 'grid' };
    }

    return { ...state, viewMode };
  }),

  on(WorkspacesActions.toggleViewMode, (state) => {
    if (!state.canUseListView) {
      return { ...state, viewMode: 'grid' };
    }

    return {
      ...state,
      viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
    };
  }),

  on(WorkspacesActions.setCanUseListView, (state, { canUseListView }) => ({
    ...state,
    canUseListView,
    viewMode: canUseListView ? state.viewMode : 'grid',
  })),
);

export const { selectAll } = adapter.getSelectors();
