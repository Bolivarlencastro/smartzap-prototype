import { Injectable } from '@angular/core';
import {
  AnalyticsEventTypes,
  AuthService,
  KonquestLearnActivitiesApi,
  LearnContent,
  LearnContentActivity,
  STEP_CONTENT_TYPE,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMediaPlayerStorageService } from '@keeps-platform-frontend-workspace/ui/kp-media-player';

const CONTENT_ACTIVITY_EVENT_MAP = new Map<Uppercase<STEP_CONTENT_TYPE>, AnalyticsEventTypes>([
  ['HTML', AnalyticsEventTypes.VIEW],
  ['HTML FILE', AnalyticsEventTypes.VIEW],
  ['IMAGE', AnalyticsEventTypes.VIEW],
  ['PDF', AnalyticsEventTypes.READ],
  ['TEXT', AnalyticsEventTypes.READ],
  ['SPREADSHEET', AnalyticsEventTypes.READ],
  ['PODCAST', AnalyticsEventTypes.LISTEN],
  ['PRESENTATION', AnalyticsEventTypes.READ],
  ['SCORM', AnalyticsEventTypes.READ],
  ['VIDEO', AnalyticsEventTypes.WATCH],
]);

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(
    private learnActivitiesApi: KonquestLearnActivitiesApi,
    private authService: AuthService,
    private mediaPlayerService: KpMediaPlayerStorageService,
  ) {}

  createLearnActivity(stepId: string, learnContent: LearnContent) {
    const action = CONTENT_ACTIVITY_EVENT_MAP.get(
      learnContent.content_type.name.toUpperCase() as Uppercase<STEP_CONTENT_TYPE>,
    );
    const learnContentActivity: LearnContentActivity = {
      action,
      mission_stage_content: stepId,
      user: this.authService.userId,
      time_start: new Date(),
      time_stop: new Date(),
    };
    if (this.shouldRegisterSpeed(action)) {
      learnContentActivity['speed'] = this.getPlayerSpeed(learnContent.url);
    }
    return this.learnActivitiesApi.create(learnContentActivity);
  }

  updateLearnActivityStopTime(learnContentActivity: LearnContentActivity, learnContent: LearnContent) {
    const learnContentActivityUpdate: Partial<LearnContentActivity> = {
      time_stop: new Date(),
    };

    if (this.shouldRegisterSpeed(learnContentActivity.action)) {
      learnContentActivityUpdate['speed'] = this.getPlayerSpeed(learnContent.url);
    }

    return this.learnActivitiesApi.update(learnContentActivity.id, learnContentActivityUpdate);
  }

  private shouldRegisterSpeed(eventType: AnalyticsEventTypes): boolean {
    return eventType === AnalyticsEventTypes.WATCH || eventType === AnalyticsEventTypes.LISTEN;
  }

  private getPlayerSpeed(contentUrl: string): number {
    return isSoundCloudUrl(contentUrl) ? 1 : this.mediaPlayerService.playbackRate;
  }
}

function isSoundCloudUrl(url: string): boolean {
  if (!url) {
    return false;
  }

  const regex = /https?:\/\/soundcloud\.com/;
  return regex.test(url);
}
