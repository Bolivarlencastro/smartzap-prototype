import { KpNotificationSmartzapModel } from '@core/services';
import { WorkspaceWithServices } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMenuApp } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { createAction, props } from '@ngrx/store';

// Processing
export const showProcessing = createAction('[UI] Show Processing Snack Bar');
export const hideProcessing = createAction('[UI] Hide Processing Snack Bar');

// Workspace
export const setSelectedWorkspace = createAction(
  '[UI] Set Selected Workspace',
  props<{ selectedWorkspace: WorkspaceWithServices }>(),
);

// Reset
export const reset = createAction('[UI] Reset State');

// Notifications
export const selectNotification = createAction(
  '[UI] Select Notification',
  props<{ notification: KpNotificationSmartzapModel }>(),
);
export const selectNotificationSuccess = createAction(
  '[UI] Select Notification Success',
  props<{ notification: any }>(),
);
export const selectNotificationFailure = createAction('[UI] Select Notification Failure', props<{ error: any }>());

export const discardNotification = createAction('[UI] Discard Notification', props<{ notificationId: string }>());
export const discardNotificationSuccess = createAction(
  '[UI] Discard Notification Success',
  props<{ notification: KpNotificationSmartzapModel }>(),
);
export const discardNotificationFailure = createAction('[UI] Discard Notification Failure', props<{ error: any }>());

export const clearAllNotifications = createAction('[UI] Clear All Notifications');

export const clearAllNotificationsSuccess = createAction('[UI] Clear All Notifications Success');

export const clearAllNotificationsFailure = createAction(
  '[UI] Clear All Notifications Failure',
  props<{ error: any }>(),
);

export const fetchNotifications = createAction('[UI] Fetch Notifications');
export const fetchNotificationSuccess = createAction(
  '[UI] Fetch Notifications Success',
  props<{ notifications: KpNotificationSmartzapModel[] }>(),
);
export const fetchNotificationFailure = createAction('[UI] Fetch Notifications Failure', props<{ error: any }>());

// Application Menu
export const getApplicationRolesSuccess = createAction(
  '[UI] Get Application Roles Success',
  props<{ apps: KpMenuApp[] }>(),
);
export const getApplicationRolesFailure = createAction('[UI] Get Ap plication Roles Failure', props<{ error: any }>());

export const appInit = createAction('[UI] App Init');
