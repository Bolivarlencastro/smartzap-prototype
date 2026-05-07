import { BellNotification, NotificationPage } from '@core/model/notification';
import { createAction, props } from '@ngrx/store';

// Fetch Notifications
export const fetchNotifications = createAction('[Notification/API] Fetch all notifications');
export const fetchNotificationsSuccess = createAction(
  '[Notification/API] Fetch all notifications success',
  props<{ payload: NotificationPage<BellNotification> }>(),
);

// Read Notification
export const readNotification = createAction('[Notification/API] Read notification ', props<{ id: string }>());
export const readNotificationSuccess = createAction(
  '[Notification/API] Read notification success',
  props<{ id: string }>(),
);

// Read All Notifications
export const readAllNotifications = createAction('[Notification/API] Read all notifications');
export const readAllNotificationsSuccess = createAction('[Notification/API] Read all notifications success');

// Select Notifications
export const selectNotification = createAction('[Notifications] Select notifications', props<{ id: string }>());

// API error
export const notificationFailure = createAction('[Notification/API] Notification API failure', props<{ error: any }>());
