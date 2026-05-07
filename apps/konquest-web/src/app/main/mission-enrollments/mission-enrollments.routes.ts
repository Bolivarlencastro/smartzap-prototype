import { Routes } from '@angular/router';
import { superAdminCanActivate, superAdminCanMatch } from '@app/shared/guard/super-admin.guard';
import { ActivityLogComponent } from './containers/activity-log/activity-log.component';
import { MissionEnrollmentsComponent } from './mission-enrollments.component';
import { MISSION_ENROLLMENTS_PROVIDERS } from './mission-enrollments.providers';
import { ENROLLMENTS_FILTER_PROVIDERS } from 'app/shared/components/enrollments-filter';

export default [
  {
    path: '',
    component: MissionEnrollmentsComponent,
    providers: [...MISSION_ENROLLMENTS_PROVIDERS, ...ENROLLMENTS_FILTER_PROVIDERS],
  },
  {
    path: 'activity-log',
    component: ActivityLogComponent,
    canMatch: [superAdminCanMatch],
    canActivate: [superAdminCanActivate],
  },
] as Routes;
