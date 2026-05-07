import { Routes } from '@angular/router';
import { CURATOR_ROLES } from '@keeps-platform-frontend-workspace/kp-keeps';

import { LearningTrailsListComponent } from './pages/list/container/learning-trails-list.component';
import { learningTrailCreateRoutes } from './pages/learning-trail-create/learning-trail-routes';
import { LEARNING_TRAIL_LIST_PROVIDERS } from './pages/list/learning-trails-list.providers';
import { LEARNING_TRAIL_CREATE_PROVIDERS } from './pages/learning-trail-create/learning-trail-create.module';
import { customSectionsFeature } from '@app/shared/guard/custom-sections-feature.guard';

export default [
  {
    path: '',
    component: LearningTrailsListComponent,
    providers: LEARNING_TRAIL_LIST_PROVIDERS,
    canActivate: [customSectionsFeature],
  },
  {
    path: 'create',
    children: learningTrailCreateRoutes,
    providers: [LEARNING_TRAIL_CREATE_PROVIDERS],
    data: {
      roles: CURATOR_ROLES,
    },
  },
] as Routes;
