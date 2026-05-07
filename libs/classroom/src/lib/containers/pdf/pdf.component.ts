import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { TranslocoService } from '@jsverse/transloco';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  imports: [KpContentActivityTrackerWrapperComponent, NgxExtendedPdfViewerModule, AsyncPipe],
})
export class ClassPDFComponent extends TrackerBaseComponent implements OnInit, OnDestroy {
  url$: Observable<string>;
  language = 'en-US';
  isViewingAsUser: Signal<boolean>;
  isMobile$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    translate: TranslocoService,
    private classroomFacade: ClassroomFacade,
  ) {
    super();
    this.language = translate.getActiveLang();
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
    this.isMobile$ = this.breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileLandscapeWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this.classroomFacade.onActivityEvent('UPDATE');
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }
}
