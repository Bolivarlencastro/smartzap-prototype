import { AsyncPipe, LowerCasePipe, NgClass } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { KpDocsUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-docs-url';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  imports: [KpContentActivityTrackerWrapperComponent, NgClass, AsyncPipe, LowerCasePipe, KpSafeUrlPipe, KpDocsUrlPipe],
})
export class ClassDocsComponent extends TrackerBaseComponent {
  isViewingAsUser: Signal<boolean>;
  url$: Observable<string>;
  contentType$: Observable<string>;

  constructor(private classroomFacade: ClassroomFacade) {
    super();
    this.isViewingAsUser = this.classroomFacade.isViewingAsUser;
    this.contentType$ = this.classroomFacade.content$.pipe(
      filter((content) => !!content),
      map((content) => content?.content_type?.name),
    );
    this.url$ = this.classroomFacade.content$.pipe(
      filter((content) => !!content),
      map((content) => content?.url),
      tap(() => {
        this.clear();
        this.initTracker();
      }),
    );
  }

  usingOfficeViewer(url: string): boolean {
    const contentRegex = /(https?:\/\/)?(www.)?(\/.*)?keepsdev.com/gm;
    return contentRegex.test(url);
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }
}
