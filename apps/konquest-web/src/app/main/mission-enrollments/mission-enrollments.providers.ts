import { importProvidersFrom } from '@angular/core';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LINK_CYCLE_DIALOG_PROVIDERS } from '../link-cycle-dialog/link-cycle-dialog.providers';
import { ActivityLogService } from './services/activity-log.service';
import { BatchActionsService } from './services/batch-actions.service';
import { MissionEnrollmentsService } from './services/mission-enrollments.service';
import { ActivityLogEffects } from './store/activity-log/activity-log.effects';
import { activityLogFeature } from './store/activity-log/activity-log.feature';
import { BatchActionsEffects } from './store/batch-actions/batch-actions.effects';
import { batchActionsFeature } from './store/batch-actions/batch-actions.feature';
import { MissionEnrollmentsEffects } from './store/mission-enrollments.effects';
import * as fromEnrollments from './store/mission-enrollments.reducer';
import { provideNgxMask } from 'ngx-mask';

export const MISSION_ENROLLMENTS_PROVIDERS = [
  MissionEnrollmentsAPI,
  MissionEnrollmentsService,
  BatchActionsService,
  ActivityLogService,
  provideNgxMask(),
  importProvidersFrom(
    EffectsModule.forFeature([MissionEnrollmentsEffects, BatchActionsEffects, ActivityLogEffects]),
    StoreModule.forFeature(fromEnrollments.missionsDoneKey, fromEnrollments.reducer),
    StoreModule.forFeature(batchActionsFeature),
    StoreModule.forFeature(activityLogFeature),
  ),
  ...LINK_CYCLE_DIALOG_PROVIDERS,
];
