import { Routes } from '@angular/router';
import { missionCreateRoutes } from './pages/mission-create/mission-create-routes';
import { MissionsComponent } from './pages/missions/containers';
import { MissionDetailResolver } from './services/mission-detail.resolver';
import { COURSES_LIST_PROVIDERS } from './pages/missions/courses-list.providers';
import { COURSE_CREATION_PROVIDERS } from './pages/mission-create/course-creation.providers';
import { customSectionsFeature } from '@app/shared/guard/custom-sections-feature.guard';

export default [
  {
    path: '',
    component: MissionsComponent,
    providers: COURSES_LIST_PROVIDERS,
    canActivate: [customSectionsFeature],
  },
  {
    path: 'create',
    children: missionCreateRoutes,
    providers: COURSE_CREATION_PROVIDERS,
  },
  {
    path: ':id/details',
    loadChildren: () => import('app/main/mission/pages/legacy-mission-detail/legacy-mission-detail.routes'),
    resolve: {
      mission: MissionDetailResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Routes;
