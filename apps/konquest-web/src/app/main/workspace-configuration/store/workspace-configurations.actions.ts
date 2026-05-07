import { WorkspaceKonquestSettings } from '@core/model';
import { ModuleService } from '@core/model/workspace-configuration.model';
import { createAction, props } from '@ngrx/store';

/******************************************************************
 * Change Module Status
 ******************************************************************/
export const changeServiceStatus = createAction(
  '[Service/API] Change Services',
  props<{ workspaceId: string; service: ModuleService; status: boolean }>(),
);

export const changeServiceStatusSuccess = createAction(
  '[Service/API] Change Services Success',
  props<{
    serviceId: string;
    status: boolean;
    navigationItemId: string;
  }>(),
);

export const changeServiceStatusFailure = createAction(
  '[Service/API] Change Services Failure',
  props<{ error: Error }>(),
);

/******************************************************************
 * Save Pass Mark
 ******************************************************************/
export const savePassMark = createAction(
  '[Service/API] Save Pass Mark',
  props<{ workspaceId: string; passMark: number }>(),
);

export const savePassMarkSuccess = createAction('[Service/API] Save Pass Mark Success');

export const savePassMarkFailure = createAction('[Service/API] Save Pass Mark Failure', props<{ error: Error }>());

/******************************************************************
 * Load Workspace Configuration
 ******************************************************************/

export const getWorkspaceConfigurations = createAction(
  '[Service/API] Get Workspace Configurations',
  props<{ workspaceId: string }>(),
);

export const getWorkspaceConfigurationsSuccess = createAction(
  '[Service/API] Get Workspace Configurations Success',
  props<{ services: ModuleService[]; settings: WorkspaceKonquestSettings }>(),
);

export const workspaceInit = createAction(
  '[Workspace/Init] Init Workspace Configurations',
  props<{
    workspaceId: string;
  }>(),
);

/******************************************************************
 * Update workspace general settings
 ******************************************************************/
export const updateWorkspaceGeneralSettings = createAction(
  '[Workspace/API] update workspace general settings',
  props<{ id: string; settings: WorkspaceKonquestSettings }>(),
);

export const updateWorkspaceGeneralSettingsSuccess = createAction(
  '[Workspace/API] update workspace general settings success',
  props<{ settings: WorkspaceKonquestSettings }>(),
);

export const updateWorkspaceGeneralSettingsFailure = createAction(
  '[Workspace/API] update workspace general settings failure',
  props<{ error: unknown }>(),
);

export const getWorkspaceConfigurationsFailure = createAction('[Service/API] Get Workspace Configurations Failure');

export const clearWorkspaceConfigurations = createAction('[Service/API] Clear Workspace Configurations');

export const updateWorkspaceGoalDate = createAction(
  '[Workspace/API] Update Workspace Goal Date',
  props<{ id: string; goal_date: number }>(),
);

export const updateWorkspaceGoalDateSuccess = createAction(
  '[Workspace/API] Update Workspace Goal Date Success',
  props<{ goal_date: number }>(),
);

export const updateGamificationModule = createAction('[Service/API] Update Gamification Module');

export const updateRegulatoryComplianceModule = createAction('[Service/API] Update Regulatory Compliance Module');
