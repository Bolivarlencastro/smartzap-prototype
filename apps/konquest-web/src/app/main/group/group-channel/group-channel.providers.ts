import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { GroupChannelAPI } from './group-channel.api';
import { GroupChannelEffects } from './store/group-channel.effects';
import * as fromGroupChannel from './store/group-channel.reducer';

export const GROUP_CHANNEL_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature([GroupChannelEffects]),
    StoreModule.forFeature(fromGroupChannel.groupChannelsFeatureKey, fromGroupChannel.reducer),
  ),
  GroupChannelAPI,
  GenericErrorHandlerService,
];
