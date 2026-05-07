import { Routes } from '@angular/router';
import { SettingComponent } from './container';
import { AdminGuard } from '@app/shared/guard/admin.guard';
import { ContentCreatorGuard } from '@app/shared/guard/content-creator.guard';

export default [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'groups',
      },
      {
        path: 'groups',
        loadChildren: () => import('../group/groups/groups.routes'),
        canActivate: [AdminGuard],
      },
      {
        path: 'configurations',
        loadChildren: () => import('../workspace-configuration/workspace-configurations.routes'),
        canActivate: [AdminGuard],
      },
      {
        path: 'categories',
        loadChildren: () => import('../category/categories/categories.routes'),
        canActivate: [AdminGuard],
      },
      {
        path: 'missions',
        data: { filteringAllUsers: true },
        loadChildren: () => import('../mission-enrollments/mission-enrollments.routes'),
        canActivate: [ContentCreatorGuard],
      },
      {
        path: 'events',
        data: { filteringAllUsers: true },
        loadChildren: () => import('../mission-enrollments/mission-enrollments.routes'),
        canActivate: [ContentCreatorGuard],
      },
      {
        path: 'learning-trails',
        data: { filteringAllUsers: true },
        loadChildren: () => import('../learning-trail-enrollments/learning-trail-enrollments.routes'),
        canActivate: [ContentCreatorGuard],
      },
      {
        path: 'transfers',
        loadChildren: () => import('../transfer/transfers.routes'),
        canActivate: [AdminGuard],
      },
    ],
  },
] as Routes;
