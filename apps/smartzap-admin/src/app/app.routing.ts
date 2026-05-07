import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'workspaces',
    pathMatch: 'full',
    redirectTo: '/courses',
  },
  {
    path: 'push-manager',
    pathMatch: 'full',
    redirectTo: '/courses',
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
    path: 'unauthorized-access',
    loadComponent: () =>
      import('./main/unauthorized-access/unauthorized-access.component').then((m) => m.UnauthorizedAccessComponent),
  },
  {
    path: '**',
    redirectTo: '/courses',
  },
];
