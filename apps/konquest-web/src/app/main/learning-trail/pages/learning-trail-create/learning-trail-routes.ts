import { Routes } from '@angular/router';
import { LearningTrailCreateComponent } from './containers/learning-trail-create.component';
import { LearningTrailImagesComponent } from './containers/learning-trail-images/learning-trail-images.component';
import { LearningTrailInfoComponent } from './containers/learning-trail-info/learning-trail-info.component';
import { LearningTrailContentComponent } from './containers/learning-trail-content/learning-trail-content.component';
import { LearningTrailFinishComponent } from './containers/learning-trail-finish/learning-trail-finish.component';

const childrenRoutes: Routes = [
  {
    path: 'info',
    component: LearningTrailInfoComponent,
  },
  {
    path: 'content',
    component: LearningTrailContentComponent,
  },
  {
    path: 'images',
    component: LearningTrailImagesComponent,
  },
  {
    path: 'finish',
    component: LearningTrailFinishComponent,
  },
  { path: '', redirectTo: 'info', pathMatch: 'full' },
];

export const learningTrailCreateRoutes: Routes = [
  {
    path: '',
    component: LearningTrailCreateComponent,
    children: childrenRoutes,
  },
  {
    component: LearningTrailCreateComponent,
    path: ':learning-trail-id',
    children: childrenRoutes,
  },
];
