import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { GroupUserEffects } from './store/group-user.effects';
import * as fromGroupUser from './store/group-user.reducer';
import { GroupUserAPI } from './group-user.api';

export const GROUP_USER_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(fromGroupUser.groupUserFeatureKey, fromGroupUser.reducer),
    EffectsModule.forFeature([GroupUserEffects]),
  ),
  GenericErrorHandlerService,
  GroupUserAPI,
];
