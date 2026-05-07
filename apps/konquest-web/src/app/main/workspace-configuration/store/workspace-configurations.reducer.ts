import { ModuleService } from '@core/model/workspace-configuration.model';
import { WorkspaceKonquestSettings } from '@core/model/workspace.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from './workspace-configurations.actions';

export const workspaceConfigurationsKey = 'workspace-configurations-app';

export interface State {
  services: ModuleService[];
  isLoading: boolean;
  settings: WorkspaceKonquestSettings | null;
}

export const workspaceConfigurationsInitialState: State = {
  services: [],
  isLoading: false,
  settings: null,
};

const workspaceConfigurationsInitialStateReducer = createReducer(
  workspaceConfigurationsInitialState,

  on(Actions.getWorkspaceConfigurations, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(Actions.updateWorkspaceGeneralSettings, Actions.changeServiceStatus, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(Actions.changeServiceStatusSuccess, (state, { status, serviceId }): State => {
    return { ...state, isLoading: false, services: updateServiceStatus(state.services, status, serviceId) };
  }),

  on(
    Actions.updateWorkspaceGeneralSettingsSuccess,
    Actions.updateWorkspaceGeneralSettingsFailure,
    Actions.changeServiceStatusFailure,
    (state): State => {
      return { ...state, isLoading: false };
    },
  ),

  on(Actions.getWorkspaceConfigurationsSuccess, (state, { services, settings }): State => {
    return { ...state, services, settings, isLoading: false };
  }),

  on(Actions.getWorkspaceConfigurationsFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(Actions.updateWorkspaceGoalDateSuccess, (state, { goal_date }): State => {
    return { ...state, settings: { ...state.settings, enrollment_goal_duration_days: goal_date }, isLoading: false };
  }),

  on(Actions.clearWorkspaceConfigurations, (): State => ({ ...workspaceConfigurationsInitialState })),
);

// General
export function reducer(state: State | undefined, action: Action) {
  return workspaceConfigurationsInitialStateReducer(state, action);
}

function updateServiceStatus(services: ModuleService[], status: boolean, serviceId: string): ModuleService[] {
  const service = services.find((service) => service.field === serviceId);
  const updatedService = { ...service, status };
  return services.map((service) => {
    if (service.field === serviceId) {
      return updatedService;
    }
    return service;
  });
}
