import { Routes } from '@angular/router';
import { MissionDetailComponent } from './containers';
import { MissionEvaluationsComponent } from './containers/mission-detail/evaluation/evaluation.component';
import { MissionEvaluationsGuard } from './containers/mission-detail/evaluation/evaluation.guard';
import { LEGACY_MISSION_DETAIL_PROVIDERS } from './mission-detail.module';

export default [
  {
    path: '',
    component: MissionDetailComponent,
    providers: LEGACY_MISSION_DETAIL_PROVIDERS,
    children: [
      {
        path: 'evaluations',
        component: MissionEvaluationsComponent,
        canActivate: [MissionEvaluationsGuard],
      },
    ],
  },
] as Routes;
