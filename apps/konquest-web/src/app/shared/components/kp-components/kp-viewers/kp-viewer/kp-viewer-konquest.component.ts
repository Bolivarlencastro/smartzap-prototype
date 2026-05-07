import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { EmbedContentType } from '@core/model';
import { ActivityService } from '@core/services/activity.service';
import { AnalyticsEventTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  ActivityTrackerComponent,
  KpPlayerActivityTrackerWrapperComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { TranslocoService } from '@jsverse/transloco';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { KpPdfViewerComponent } from '../kp-pdf-viewer/kp-pdf-viewer.component';
import { KpImageViewerComponent } from '../kp-image-viewer/kp-image-viewer.component';
import { KpDocsViewerComponent } from '../kp-docs-viewer/kp-docs-viewer.component';
import { KpAudioPlayerComponent } from '@keeps-platform-frontend-workspace/ui/kp-audio-player';
import { KpMediaPlayerComponent } from '@keeps-platform-frontend-workspace/ui/kp-media-player';

@Component({
  selector: 'kp-viewer-konquest',
  templateUrl: './kp-viewer-konquest.component.html',
  styleUrls: ['./kp-viewer-konquest.component.scss'],
  imports: [
    KpContentActivityTrackerWrapperComponent,
    KpPdfViewerComponent,
    KpImageViewerComponent,
    KpDocsViewerComponent,
    KpPlayerActivityTrackerWrapperComponent,
    KpAudioPlayerComponent,
    KpMediaPlayerComponent,
  ],
})
export class KpViewerKonquestComponent implements AfterViewInit {
  @Input() url!: string;
  @Input() contentType!: EmbedContentType;
  @Input() contentId!: string;
  @Input() holder!: 'MISSION' | 'PULSE';
  @Input() disableActivityEvents: boolean;
  @Input() enableImageFullscreen = true;
  @Input() mediaPlayerClass: string;

  private startTrackingWhenTrackerAvailable = false;
  readonly currentLanguage: string;

  @ViewChild('tracker')
  tracker!: ActivityTrackerComponent;

  @ViewChild('trackerPlayer')
  trackerPlayer!: ActivityTrackerComponent;

  EmbedContentType: typeof EmbedContentType = EmbedContentType;

  constructor(
    private _activityService: ActivityService,
    private translocoService: TranslocoService,
  ) {
    this.currentLanguage = this.translocoService.getActiveLang();
  }

  onContentStarted(): void {
    if (!this.tracker) {
      this.startTrackingWhenTrackerAvailable = true;
      return;
    }
    this.tracker?.init();
  }

  ngAfterViewInit() {
    if (this.startTrackingWhenTrackerAvailable) {
      this.tracker?.init();
      this.startTrackingWhenTrackerAvailable = false;
    }
  }

  onPlayerStarted(): void {
    this.trackerPlayer?.init();
  }

  onPlayerPaused(): void {
    this.trackerPlayer.clear();
    this._activityService.leave();
  }

  onTrackingActivity(activityType: 'CREATE' | 'UPDATE'): void {
    const activity: Record<string, any> = {
      [EmbedContentType.Podcast]: AnalyticsEventTypes.LISTEN,
      [EmbedContentType.Video]: AnalyticsEventTypes.WATCH,
      [EmbedContentType.Image]: AnalyticsEventTypes.VIEW,
      default: AnalyticsEventTypes.READ,
    };

    if (activityType === 'CREATE') {
      this._activityService.registry(
        { pulse: this.contentId },
        activity[this.contentType] ?? activity['default'],
        this.url,
      );
    } else {
      this._activityService.update();
    }
  }
}
