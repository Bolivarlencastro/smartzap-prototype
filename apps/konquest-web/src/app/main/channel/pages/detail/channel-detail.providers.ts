import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PulseQuizService } from '@core/api/pulse-quiz.service';
import { ChannelDetailGuard } from './channel-detail.guard';
import { ChannelDetailService } from './channel-detail.service';
import {
  ChannelDetailCommentEffects,
  ChannelDetailEffects,
  ChannelDetailPulsesEffects,
  ChannelDetailRatingsEffects,
  ChannelDetailSubscriptionsEffects,
} from './store/effects';
import {
  ChannelDetailCommentReducers,
  ChannelDetailPulsesReducers,
  ChannelDetailRatingsReducers,
  ChannelDetailReducers,
  ChannelDetailSubscriptionsReducers,
} from './store/reducers';
import {
  ChannelDetailCommentSelectors,
  ChannelDetailPulsesSelectors,
  ChannelDetailRatingsSelectors,
  ChannelDetailSelectors,
  ChannelDetailSubscriptionsSelectors,
} from './store/selectors';

export const CHANNEL_DETAIL_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(ChannelDetailSelectors.channelDetailFeatureKey, ChannelDetailReducers.reducers),
    StoreModule.forFeature(ChannelDetailSelectors.deleteFeatureKey, ChannelDetailReducers.deleteReducers),
    StoreModule.forFeature(
      ChannelDetailCommentSelectors.channelCommentFeatureKey,
      ChannelDetailCommentReducers.reducers,
    ),
    StoreModule.forFeature(
      ChannelDetailCommentSelectors.getCommentsFeatureKey,
      ChannelDetailCommentReducers.getReducers,
    ),
    StoreModule.forFeature(ChannelDetailPulsesSelectors.getPulsesFeatureKey, ChannelDetailPulsesReducers.reducers),
    StoreModule.forFeature(
      ChannelDetailRatingsSelectors.channelRatingFeatureKey,
      ChannelDetailRatingsReducers.reducers,
    ),
    StoreModule.forFeature(
      ChannelDetailSubscriptionsSelectors.channelSubscriptionsFeatureKey,
      ChannelDetailSubscriptionsReducers.reducers,
    ),
    EffectsModule.forFeature([
      ChannelDetailEffects,
      ChannelDetailCommentEffects,
      ChannelDetailPulsesEffects,
      ChannelDetailRatingsEffects,
      ChannelDetailSubscriptionsEffects,
    ]),
  ),
  ChannelDetailGuard,
  ChannelDetailService,
  PulseQuizService,
];
