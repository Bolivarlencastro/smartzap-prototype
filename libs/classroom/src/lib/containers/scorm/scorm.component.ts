import { Component, effect, ElementRef, OnDestroy, Signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CMI, LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpContentActivityTrackerWrapperComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-activity-tracker-wrapper';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';
import { Scorm12API } from 'scorm-again';
import { ScormUrlResolver } from '../../services/scorm/scorm-url.resolver';

// Scorm API types
declare global {
  interface Window {
    API?: Scorm12API;
  }
}

type ScormAgainEvent = { cmi: CMI };

@Component({
  templateUrl: './scorm.component.html',
  styleUrls: ['./scorm.component.scss'],
  providers: [ScormUrlResolver],
  imports: [KpContentActivityTrackerWrapperComponent],
})
export class ClassScormComponent extends TrackerBaseComponent implements OnDestroy {
  @ViewChild('iframe')
  iframe!: ElementRef<HTMLIFrameElement>;
  isViewingAsUser: Signal<boolean>;

  readonly content: Signal<LearnContent>;
  readonly scormCMI: Signal<CMI>;

  constructor(
    private classroomFacade: ClassroomFacade,
    private readonly scormUrlResolver: ScormUrlResolver,
  ) {
    super();
    this.isViewingAsUser = this.classroomFacade.isViewingAsUser;
    this.loadScormCMI();

    this.content = toSignal(this.classroomFacade.content$);
    this.scormCMI = toSignal(this.classroomFacade.scormCMI$);

    effect(() => {
      const content = this.content();
      const cmi = this.scormCMI();

      if (content && cmi) {
        this.initScormApi();
        this.clear();
        this.tracker.init();
        this.loadScormContent(content.url, cmi);
      }
    });
  }

  ngOnDestroy(): void {
    this.classroomFacade.saveLastEmittedScormCMI();
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }

  private initScormApi() {
    window.API = new Scorm12API({});
  }

  private loadScormCMI() {
    this.classroomFacade
      .getScormCMIStream()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.classroomFacade.loadScormCMI());
  }

  private loadScormContent(url: string, cmi: CMI) {
    // We need to reset the SCORM API when navigating between contents
    window.API?.reset();
    window.API.loadFromJSON(cmi);
    this.initListeners();
    this.iframe.nativeElement.src = this.scormUrlResolver.resolveUrl(url);
  }

  private initListeners() {
    window.API.on('LMSSetValue.cmi.*', () => {
      const cmi = window.API?.renderCMIToJSONObject() as unknown as ScormAgainEvent;
      this.onCmiEvent(cmi.cmi, 'UPDATE');
    });

    window.API.on('LMSCommit', () => {
      const cmi = window.API?.renderCMIToJSONObject() as unknown as ScormAgainEvent;
      this.onCmiEvent(cmi.cmi, 'COMMIT');
    });
  }

  private onCmiEvent(cmi: CMI, event: 'COMMIT' | 'UPDATE') {
    this.classroomFacade.storeLastEmittedScormCMI(cmi);
    if (event === 'COMMIT') {
      this.classroomFacade.saveScormCMI(cmi);
    }
  }
}
