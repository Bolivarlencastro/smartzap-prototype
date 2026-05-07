import { Routes } from '@angular/router';
import { WorkspaceGuard } from './shared/guard/workspace.guard';
import { AdminAccessGuard, ReportsGuard } from './shared/auth/guard';
import { environment } from 'environments/environment';
import { canActivateAuthGuard } from '@keeps-platform-frontend-workspace/kp-keeps';

export const routes: Routes = [
  {
    path: 'workspaces',
    loadChildren: () =>
      import('@keeps-platform-frontend-workspace/workspaces').then((m) => {
        m.WorkspacesModule.moduleConfig = { logoUrl: environment.workspacesPageLogo, environment };
        return m.WorkspacesModule;
      }),
    data: { layout: 'empty' },
    canActivate: [canActivateAuthGuard],
  },

  {
    path: 'dashboard',
    canMatch: [WorkspaceGuard, AdminAccessGuard],
    canActivate: [WorkspaceGuard, canActivateAuthGuard, AdminAccessGuard],
    loadComponent: () => import('./main/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
  },

  {
    path: 'course',
    loadChildren: () => import('./main/course/course.routes'),
    canMatch: [WorkspaceGuard, AdminAccessGuard],
    canActivate: [WorkspaceGuard, canActivateAuthGuard, AdminAccessGuard],
  },

  {
    path: 'user',
    canMatch: [WorkspaceGuard],
    canActivate: [WorkspaceGuard, canActivateAuthGuard],
    loadChildren: () => import('./main/user/user.routes'),
  },

  {
    path: 'report',
    canMatch: [WorkspaceGuard, ReportsGuard],
    canActivate: [WorkspaceGuard, canActivateAuthGuard, ReportsGuard],
    loadChildren: () => import('./main/report/report.routes'),
  },

  {
    path: 'error',
    canMatch: [WorkspaceGuard],
    canActivate: [WorkspaceGuard, canActivateAuthGuard],
    loadComponent: () => import('./main/errors/errors.component').then((mod) => mod.ErrorsComponent),
  },

  // otherwise redirect to home
  {
    path: '**',
    redirectTo: environment.routeHome,
  },
];
