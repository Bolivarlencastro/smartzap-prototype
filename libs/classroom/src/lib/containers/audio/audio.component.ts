import { AsyncPipe } from '@angular/common';
import { Component, Signal, signal } from '@angular/core';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { KpMediaPlayerComponent } from '@keeps-platform-frontend-workspace/ui/kp-media-player';
import {
  ActivityTrackerEvent,
  KpPlayerActivityTrackerWrapperComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  imports: [
    KpContentActivityTrackerWrapperComponent,
    KpPlayerActivityTrackerWrapperComponent,
    KpMediaPlayerComponent,
    AsyncPipe,
    KpSafeUrlPipe,
  ],
})
export class ClassAudioComponent extends TrackerBaseComponent {
  url$!: Observable<string>;
  isViewingAsUser: Signal<boolean>;
  isSoundCloud = signal(false);

  constructor(private classroomFacade: ClassroomFacade) {
    super();
    this.isViewingAsUser = this.classroomFacade.isViewingAsUser;
    this.url$ = this.classroomFacade.content$.pipe(
      filter((content) => !!content),
      tap(() => this.clear()),
      map((content) => this.checkSoundCloudUrl(content.url)),
      map(({ url, isSoundCloud }) => {
        if (isSoundCloud) {
          this.initTracker();
        }
        this.isSoundCloud.set(isSoundCloud);
        return url;
      }),
    );
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }

  private checkSoundCloudUrl(audioUrl: string): { url: string; isSoundCloud: boolean } {
    const isSoundCloud = audioUrl?.includes('soundcloud');
    if (isSoundCloud) {
      return { url: `https://w.soundcloud.com/player/?url=${audioUrl}`, isSoundCloud };
    }

    return { url: audioUrl, isSoundCloud };
  }
}
