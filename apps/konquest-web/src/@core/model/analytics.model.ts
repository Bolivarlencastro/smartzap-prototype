import { AnalyticsEventTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BaseEntity } from './base-entity.model';
import { EmbedContentType } from './learn-content.model';

export const DEFAULT_VIEWER_DELAY = 3000;
export const DEFAULT_READ_DELAY = 6000;

export interface AnalyticsEvent {
  type: AnalyticsEventTypes;
  holder?: 'PULSE' | 'MISSION';
  contentId?: string;
  contentType: EmbedContentType;
  timestamp: Date;
}
export abstract class GenericAnalyticsEvent implements AnalyticsEvent {
  timestamp: Date;
  constructor(
    public type: AnalyticsEventTypes,
    public contentType: EmbedContentType,
  ) {
    this.timestamp = new Date();
  }
}
export class ReadEvent extends GenericAnalyticsEvent {
  constructor(contentType: EmbedContentType) {
    super(AnalyticsEventTypes.READ, contentType);
  }
}

export class WatchEvent extends GenericAnalyticsEvent {
  constructor(contentType: EmbedContentType) {
    super(AnalyticsEventTypes.WATCH, contentType);
  }
}
export class ListenEvent extends GenericAnalyticsEvent {
  constructor(contentType: EmbedContentType) {
    super(AnalyticsEventTypes.LISTEN, contentType);
  }
}

export class ViewEvent extends GenericAnalyticsEvent {
  constructor(contentType: EmbedContentType) {
    super(AnalyticsEventTypes.VIEW, contentType);
  }
}
export class LeaveEvent extends GenericAnalyticsEvent {
  constructor(contentType: EmbedContentType) {
    super(AnalyticsEventTypes.LEAVE, contentType);
  }
}

export interface LearnContentActivity extends BaseEntity {
  action: AnalyticsEventTypes;
  time_start: Date;
  time_stop?: Date;
  time_in?: number;
  user?: string;
  mission_stage_content?: string;
  pulse?: string;
  speed?: number;
}

export class AnalyticsActivity implements LearnContentActivity {
  action: AnalyticsEventTypes;
  time_start: Date;
  time_stop?: Date;
  user: string;
  mission_stage_content: string;
  pulse?: string;

  constructor(event: AnalyticsEvent) {
    this.action = event.type;
    this.time_start = event.timestamp;
    this.pulse = event.holder === 'PULSE' ? event.contentId : null;
    this.mission_stage_content = event.holder === 'MISSION' ? event.contentId : null;
  }
}
