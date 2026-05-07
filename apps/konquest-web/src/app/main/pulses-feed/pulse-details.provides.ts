import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChannelsListService } from './services/channels-list.service';
import { FeedService } from './services/feed.service';
import { PulseDetailsService } from './services/pulse-details.service';
import { PulsesListService } from './services/pulses-list.service';
import { ChannelsListEffects } from './store/channels-list/channels-list.effects';
import { channelsListFeature } from './store/channels-list/channels-list.feature';
import { FeedEffects } from './store/feed/feed.effects';
import { feedFeature } from './store/feed/feed.feature';
import { PulseDetailsEffects } from './store/pulse-details/pulse-details.effects';
import { pulseDetailsFeature } from './store/pulse-details/pulse-details.feature';
import { PulseFeedQuizEffects } from './store/pulse-feed-quiz/pulse-feed-quiz.effects';
import { pulseFeedQuizFeature } from './store/pulse-feed-quiz/pulse-feed-quiz.feature';
import { PulseChannelActionEffects } from './store/pulse-channel-action/pulse-channel-action.effects';
import { PulsesListEffects } from './store/pulses-list/pulses-list.effects';
import { pulsesListFeature } from './store/pulses-list/pulses-list.feature';

export const PULSE_DETAILS_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(feedFeature),
    StoreModule.forFeature(pulsesListFeature),
    StoreModule.forFeature(channelsListFeature),
    StoreModule.forFeature(pulseDetailsFeature),
    StoreModule.forFeature(pulseFeedQuizFeature),
    EffectsModule.forFeature([
      FeedEffects,
      PulsesListEffects,
      ChannelsListEffects,
      PulseDetailsEffects,
      PulseFeedQuizEffects,
      PulseChannelActionEffects,
    ]),
  ),
  FeedService,
  PulsesListService,
  ChannelsListService,
  PulseDetailsService,
];
