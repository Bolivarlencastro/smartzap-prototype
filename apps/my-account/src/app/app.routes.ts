import { Routes } from '@angular/router';
import { canActivateAuthGuard, workspacesGuardActivate } from '@keeps-platform-frontend-workspace/kp-keeps';
import { WorkspaceGuard } from 'app/shared/guard/workspace.guard';
import { environment } from 'environments/environment';
import { ActivityLogComponent } from 'app/main/activity-log/activity-log.component';

export const routes: Routes = [
  {
    path: 'workspace/profile',
    loadChildren: () => import('./main/workspace/workspace.routes'),
    canActivate: [canActivateAuthGuard, WorkspaceGuard],
    data: {
      roles: ['company_admin', 'keeps_admin'],
    },
  },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/workspaces').then((m) => {
        m.WorkspacesModule.moduleConfig = {
          logoUrl: environment.workspacesPageLogo,
          environment,
          isMyAccount: true,
        };
        return m.WorkspacesModule;
      }),
    data: { layout: 'empty', roles: [] },
  },
  {
    path: 'users',
    loadChildren: () => import('./main/users/users.routes'),
    canActivate: [canActivateAuthGuard],
    data: {
      roles: ['keeps_admin', 'company_admin'],
    },
  },
  {
    path: 'user/profile',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/profile').then((m) => {
        m.ProfileModule.moduleConfig = {
          keycloak: {
            url: environment.keycloakConfig.url,
            realm: environment.keycloakConfig.realm,
            clientId: environment.keycloakConfig.clientId,
          },
        };
        return m.ProfileModule;
      }),
    canLoad: [workspacesGuardActivate],
    data: {
      roles: [],
    },
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./main/backoffice/backoffice.routes'),
  },
  {
    path: 'activity-log',
    component: ActivityLogComponent,
    canActivate: [canActivateAuthGuard],
    data: {
      roles: ['keeps_admin', 'company_admin'],
    },
  },
  {
    path: 'tools-hub',
    loadChildren: () => import('./main/tools-hub/tools-hub.routes'),
    canActivate: [canActivateAuthGuard],
    data: {
      roles: ['keeps_admin', 'company_admin'],
    },
  },
  {
    path: '**',
    redirectTo: environment.routeHome,
  },
];
