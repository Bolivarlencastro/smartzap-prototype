import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoursesLeaderApi } from './services/courses-leader.api';
import { EventsLeaderApi } from './services/events-leader.api';
import { LedListService } from './services/led-list.service';
import { ListService } from './services/list.service';
import { TrailsLeaderApi } from './services/trails-leader.api';
import { OverviewService } from './services/overview.service';
import { TabsService } from './services/tabs.service';
import { CHANNEL_EFFECTS, channelDialogFeature, channelListFeature } from './store/channel';
import { COURSE_EFFECTS, courseDialogFeature, courseListFeature } from './store/course';
import { EVENT_EFFECTS, eventDialogFeature, eventListFeature } from './store/event';
import { LedListEffects, ledListFeature } from './store/led';
import {
  LED_OVERVIEW_EFFECTS,
  ledChannelTabFeature,
  ledCoursesTabFeature,
  ledEnrollmentActivityFeature,
  ledEventTabFeature,
  ledOverviewFeature,
  ledOverviewTabFeature,
  ledPulseTabFeature,
  ledTrailCoursesFeature,
  ledTrailsTabFeature,
} from './store/led-overview';
import { OverviewEffects, overviewFeature } from './store/overview';
import { PULSE_EFFECTS, pulseDialogFeature, pulseListFeature } from './store/pulse';
import { TRAIL_EFFECTS, trailDialogFeature, trailListFeature } from './store/trail';
import { getTranslocoScope } from './transloco-scope.factory';

const EFFECTS = [
  OverviewEffects,
  LedListEffects,
  ...TRAIL_EFFECTS,
  ...PULSE_EFFECTS,
  ...EVENT_EFFECTS,
  ...CHANNEL_EFFECTS,
  ...COURSE_EFFECTS,
  ...LED_OVERVIEW_EFFECTS,
];

const SERVICES = [
  getTranslocoScope(),
  TabsService,
  OverviewService,
  ListService,
  LedListService,
  CoursesLeaderApi,
  TrailsLeaderApi,
  EventsLeaderApi,
];

export const LEADER_PANEL_PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(overviewFeature),
    StoreModule.forFeature(courseListFeature),
    StoreModule.forFeature(ledListFeature),
    StoreModule.forFeature(trailListFeature),
    StoreModule.forFeature(pulseListFeature),
    StoreModule.forFeature(channelListFeature),
    StoreModule.forFeature(eventListFeature),
    StoreModule.forFeature(ledOverviewFeature),
    StoreModule.forFeature(ledChannelTabFeature),
    StoreModule.forFeature(ledPulseTabFeature),
    StoreModule.forFeature(ledEventTabFeature),
    StoreModule.forFeature(ledCoursesTabFeature),
    StoreModule.forFeature(ledTrailsTabFeature),
    StoreModule.forFeature(ledOverviewTabFeature),
    StoreModule.forFeature(ledEnrollmentActivityFeature),
    StoreModule.forFeature(ledTrailCoursesFeature),
    StoreModule.forFeature(courseDialogFeature),
    StoreModule.forFeature(trailDialogFeature),
    StoreModule.forFeature(pulseDialogFeature),
    StoreModule.forFeature(channelDialogFeature),
    StoreModule.forFeature(eventDialogFeature),
    EffectsModule.forFeature(EFFECTS),
  ]),
  ...SERVICES,
];
