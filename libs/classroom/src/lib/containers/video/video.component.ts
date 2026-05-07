import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { KpMediaPlayerComponent } from '@keeps-platform-frontend-workspace/ui/kp-media-player';
import {
  ActivityTrackerEvent,
  KpPlayerActivityTrackerWrapperComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TrackerBaseComponent } from '../../abstract/tracker-base/tracker-base.component';
import { ClassroomFacade } from '../../facades';
import { getTranslocoScope } from '../../transloco-scope.factory';

@Component({
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  imports: [
    KpPlayerActivityTrackerWrapperComponent,
    KpMediaPlayerComponent,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
    MatIcon,
    MatSidenavModule,
    MatTooltip,
  ],
  providers: [getTranslocoScope()],
})
export class ClassVideoComponent extends TrackerBaseComponent {
  isViewingAsUser: Signal<boolean>;
  url$: Observable<string>;
  transcription: string;
  protected readonly currentLanguage: string;
  protected showPlayer = true;

  constructor(
    private classroomFacade: ClassroomFacade,
    private translocoService: TranslocoService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.isViewingAsUser = this.classroomFacade.isViewingAsUser;
    this.url$ = this.classroomFacade.content$.pipe(
      filter((content) => !!content),
      map((content) => {
        this.generateTranscription(content.content_transcript);
        this.reloadPlayer();
        return content?.url;
      }),
      tap(() => this.clear()),
    );
    this.currentLanguage = this.translocoService.getActiveLang();
  }

  onTrackingActivity(event: ActivityTrackerEvent): void {
    this.classroomFacade.onActivityEvent(event);
  }

  private generateTranscription(transcription: string) {
    if (!transcription || transcription === 'Could not retrieve a transcript') {
      return;
    }

    this.transcription = transcription;
  }

  reloadPlayer() {
    this.showPlayer = false;

    setTimeout(() => {
      this.showPlayer = true;
      this.cdr.detectChanges();
    }, 0);
  }
}
