import { KpMenuApp } from '@keeps-platform-frontend-workspace/ui/kp-menu';
import { createReducer, on } from '@ngrx/store';

import { KpNotificationSmartzapModel } from '@core/services';
import { WorkspaceWithServices } from '@keeps-platform-frontend-workspace/kp-keeps';
import { UIActions } from '../actions';

const languages = [
  {
    id: 'en',
    title: 'English',
    flag: 'us',
  },
  {
    id: 'es',
    title: 'Spanish',
    flag: 'es',
  },
  {
    id: 'pt-BR',
    title: 'Portuguese',
    flag: 'pt-BR',
  },
];

export const featureKey = 'ui';

export interface State {
  languages: any[];
  selectedWorkspace: WorkspaceWithServices | null;
  apps: KpMenuApp[];
  notifications: KpNotificationSmartzapModel[];
}

export const initialState: State = {
  languages,
  selectedWorkspace: null,
  apps: [],
  notifications: [],
};

export const UIReducer = createReducer(
  initialState,

  on(UIActions.setSelectedWorkspace, (state, { selectedWorkspace }): State => {
    return {
      ...state,
      selectedWorkspace,
    };
  }),

  on(UIActions.getApplicationRolesSuccess, (state, { apps }): State => {
    return {
      ...state,
      apps,
    };
  }),

  on(UIActions.fetchNotificationSuccess, (state, { notifications }): State => {
    return {
      ...state,
      notifications,
    };
  }),

  on(UIActions.clearAllNotificationsSuccess, (state): State => {
    return {
      ...state,
      notifications: [],
    };
  }),
);
