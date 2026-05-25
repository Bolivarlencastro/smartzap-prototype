import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'workspaces',
    pathMatch: 'full',
    redirectTo: '/courses',
  },
  {
    path: 'push-manager',
    loadChildren: () => import('@keeps-platform-frontend-workspace/push-manager').then((m) => m.pushManagerRoutes),
  },
  {
    path: 'courses',
    loadChildren: () => import('./main/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./main/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./main/settings/settings.routes'),
  },
  {
    path: 'certificates',
    loadChildren: () => import('./main/certificates/certificates.routes'),
  },
  {
    path: 'unauthorized-access',
    loadComponent: () =>
      import('./main/unauthorized-access/unauthorized-access.component').then((m) => m.UnauthorizedAccessComponent),
  },
  {
    path: '**',
    redirectTo: '/courses',
  },
];
