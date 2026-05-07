import { KpNotification } from '@keeps-platform-frontend-workspace/ui/kp-notification';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNotification from '../reducers/notification.reducer';

export const selectNotificationState = createFeatureSelector<fromNotification.State>(fromNotification.featureKey);
export const selectAll = createSelector(selectNotificationState, fromNotification.selectAll);
export const selectCount = createSelector(selectNotificationState, fromNotification.selectTotal);
export const selectEntities = createSelector(selectNotificationState, fromNotification.selectEntities);
export const selectNotifications = createSelector(selectAll, (notifications) => {
  return notifications.map(toKpNotification);
});
export const selectCurrentNotification = (id: string) => {
  return createSelector(selectEntities, (userEntities) => id && userEntities[id]);
};

const toKpNotification = ({ id, title, message, createdAt }): KpNotification => {
  return {
    id,
    title,
    description: message,
    created_at: createdAt,
  };
};
