import { BellNotification } from '@core/model/notification';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as fromActions from '../actions/notification.actions';

export const featureKey = 'notification-feature';

export interface State extends EntityState<BellNotification> {
  count: number;
}

export const adapter: EntityAdapter<BellNotification> = createEntityAdapter<BellNotification>();

export const initialState: State = adapter.getInitialState({
  count: 0,
});

const notificationReducer = createReducer(
  initialState,

  on(fromActions.fetchNotificationsSuccess, (state, { payload }): State => {
    return adapter.setAll(payload.results, state);
  }),

  on(fromActions.readNotificationSuccess, (state, { id }): State => {
    return adapter.removeOne(id, state);
  }),

  on(fromActions.readAllNotificationsSuccess, (state): State => {
    return adapter.removeAll(state);
  }),
);

export function reducer(state: State | undefined, action: Action): any {
  return notificationReducer(state, action);
}

export const { selectAll, selectTotal, selectEntities } = adapter.getSelectors();
