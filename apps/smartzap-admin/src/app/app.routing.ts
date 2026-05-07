import { Routes } from '@angular/router';
import { canActivateAuthGuard, workspacesGuardMatch } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { AdminAccessGuard } from './shared/auth/guard/admin-access.guard';
import { WorkspaceGuard } from './shared/guard/workspace.guard';

const authGuards = environment.prototypeMode ? [] : [canActivateAuthGuard];
const protectedMatchGuards = environment.prototypeMode ? [] : [workspacesGuardMatch];
const protectedActivateGuards = environment.prototypeMode
  ? []
  : [canActivateAuthGuard, WorkspaceGuard, AdminAccessGuard];
const workspaceActivateGuards = environment.prototypeMode ? [] : [canActivateAuthGuard, WorkspaceGuard];

export const routes: Routes = [
  ...(environment.prototypeMode
    ? [{ path: 'workspaces', pathMatch: 'full' as const, redirectTo: '/courses' }]
    : [
        {
          path: 'workspaces',
          loadChildren: () =>
            import('@keeps-platform-frontend-workspace/workspaces').then((m) => {
              m.WorkspacesModule.moduleConfig = { logoUrl: environment.workspacesPageLogo, environment };
              return m.WorkspacesModule;
            }),
          data: { layout: 'empty' },
          canActivate: authGuards,
        },
      ]),
  {
    path: 'courses',
    loadChildren: () => import('./main/courses/courses.module').then((m) => m.CoursesModule),
    canMatch: protectedMatchGuards,
    canActivate: protectedActivateGuards,
  },
  {
    path: 'users',
    loadChildren: () => import('./main/users/users.module').then((m) => m.UsersModule),
    canMatch: protectedMatchGuards,
    canActivate: protectedActivateGuards,
  },
  {
    path: 'settings',
    loadChildren: () => import('./main/settings/settings.routes'),
    canMatch: protectedMatchGuards,
    canActivate: protectedActivateGuards,
  },
  {
    path: 'unauthorized-access',
    loadComponent: () =>
      import('./main/unauthorized-access/unauthorized-access.component').then((m) => m.UnauthorizedAccessComponent),
    canMatch: protectedMatchGuards,
    canActivate: workspaceActivateGuards,
  },
  ...(environment.prototypeMode
    ? [{ path: 'push-manager', pathMatch: 'full' as const, redirectTo: '/courses' }]
    : [
        {
          path: 'push-manager',
          loadChildren: () =>
            import('@keeps-platform-frontend-workspace/push-manager').then((m) => m.pushManagerRoutes),
          canMatch: protectedMatchGuards,
          canActivate: protectedActivateGuards,
        },
      ]),
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: '/courses',
  },
];
