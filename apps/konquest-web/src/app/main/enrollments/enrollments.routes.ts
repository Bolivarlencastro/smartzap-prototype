import { Routes } from '@angular/router';
import { LearningTrailEnrollmentsComponent } from '../learning-trail-enrollments/learning-trail-enrollments.component';
import { MissionEnrollmentsComponent } from '../mission-enrollments/mission-enrollments.component';
import { EnrollmentsComponent } from './enrollments.component';
import { missionEnrollmentsGuard } from 'app/main/enrollments/guards/mission-enrollments.guard';
import { learningTrailsEnrollmentsGuard } from 'app/main/enrollments/guards/learning-trails-enrollments.guard';
import { USER_ENROLLMENTS_LIST_PROVIDERS } from './enrollments.providers';

export default [
  {
    path: '',
    component: EnrollmentsComponent,
    providers: USER_ENROLLMENTS_LIST_PROVIDERS,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'missions',
      },
      {
        path: 'missions',
        component: MissionEnrollmentsComponent,
        canActivate: [missionEnrollmentsGuard],
      },
      {
        path: 'learning-trails',
        component: LearningTrailEnrollmentsComponent,
        canMatch: [learningTrailsEnrollmentsGuard],
      },
      {
        path: 'events',
        component: MissionEnrollmentsComponent,
        canActivate: [missionEnrollmentsGuard],
      },
    ],
  },
] as Routes;
