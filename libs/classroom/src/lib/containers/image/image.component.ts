import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { FullScreenViewer } from 'iv-viewer';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  imports: [KpContentActivityTrackerWrapperComponent, AsyncPipe],
})
export class ClassImageComponent extends TrackerBaseComponent implements OnInit, OnDestroy {
  isViewingAsUser: Signal<boolean>;
  url$: Observable<string>;

  private _viewer: FullScreenViewer;

  constructor(private classroomFacade: ClassroomFacade) {
    super();
    this.isViewingAsUser = this.classroomFacade.isViewingAsUser;
    this.url$ = this.classroomFacade.content$.pipe(
      filter((content) => !!content),
      map((content) => content?.url),
      tap(() => {
        this.clear();
        this.initTracker();
      }),
    );
  }

  ngOnInit(): void {
    this._viewer = new FullScreenViewer();
  }

  ngOnDestroy(): void {
    if (this._viewer) {
      this._viewer.destroy();
    }
  }

  onClick(url: string): void {
    this._viewer.show(url);
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }
}
