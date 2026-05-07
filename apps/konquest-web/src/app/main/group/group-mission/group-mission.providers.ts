import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { GroupMissionAPI } from './group-mission.api';
import { GroupMissionEffects } from './store/group-mission.effects';
import * as fromGroupMission from './store/group-mission.reducer';

export const GROUP_MISSION_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(fromGroupMission.groupMissionsFeatureKey, fromGroupMission.reducer),
    EffectsModule.forFeature([GroupMissionEffects]),
  ),
  GenericErrorHandlerService,
  GroupMissionAPI,
];
