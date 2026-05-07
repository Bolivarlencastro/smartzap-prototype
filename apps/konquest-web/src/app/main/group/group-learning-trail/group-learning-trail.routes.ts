import { GroupLearningTrailsPageComponent } from './containers';
import { Routes } from '@angular/router';
import { GROUP_LEARNING_TRAIL_PROVIDERS } from './group-learning-trail.providers';

export default [
  {
    path: '',
    component: GroupLearningTrailsPageComponent,
    providers: GROUP_LEARNING_TRAIL_PROVIDERS,
  },
] as Routes;
