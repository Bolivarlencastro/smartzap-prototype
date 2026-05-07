import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, Renderer2, Signal } from '@angular/core';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';

const H5P_RESIZER_ELEMENT_ID = 'h5p-resizer-scrip';
const H5P_RESIZER_SCRIPT_SRC = 'https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js';

@Component({
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
  imports: [KpContentActivityTrackerWrapperComponent, AsyncPipe, KpSafeUrlPipe],
})
export class ClassHtmlComponent extends TrackerBaseComponent implements OnDestroy {
  isViewingAsUser: Signal<boolean>;
  url$: Observable<string>;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private classroomFacade: ClassroomFacade,
  ) {
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
    this.addH5PResizerScript();
  }

  ngOnDestroy(): void {
    this.removeH5PResizerScript();
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }

  private addH5PResizerScript() {
    const resizerScript = this.document.createElement('script');
    resizerScript.id = H5P_RESIZER_ELEMENT_ID;
    resizerScript.type = 'text/javascript';
    resizerScript.async = true;
    resizerScript.src = H5P_RESIZER_SCRIPT_SRC;

    this.renderer.appendChild(document.body, resizerScript);
  }

  private removeH5PResizerScript() {
    const resizerScriptElement = this.document.getElementById(H5P_RESIZER_ELEMENT_ID);
    if (resizerScriptElement) {
      this.renderer.removeChild(document.body, resizerScriptElement);
    }
  }
}
