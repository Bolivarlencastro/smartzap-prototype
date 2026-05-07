import { importProvidersFrom } from '@angular/core';
import * as ChannelTypesReducers from '../../store/channel-types/channel-types.reducers';
import * as ChannelTypesSelectors from '../../store/channel-types/channel-types.selectors';
import { ChannelTypesEffects } from '../../store/channel-types/channel-types.effects';
import { ChannelEffects } from '../../store/channel/channel.effects';
import * as ChannelReducers from '../../store/channel/channel.reducers';
import * as ChannelSelectors from '../../store/channel/channel.selectors';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChannelFormEffects } from './store/effects';
import { ChannelFormReducers } from './store/reducers';
import { ChannelFormSelectors } from './store/selectors';

export const CHANNEL_FORM_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(ChannelFormSelectors.featureKey, ChannelFormReducers.getReducer),
    StoreModule.forFeature(ChannelSelectors.featureKey, ChannelReducers.reducer),
    StoreModule.forFeature(ChannelTypesSelectors.featureKey, ChannelTypesReducers.reducer),
    EffectsModule.forFeature([ChannelFormEffects, ChannelEffects, ChannelTypesEffects /* ChannelCategoriesEffects */]),
  ),
];
