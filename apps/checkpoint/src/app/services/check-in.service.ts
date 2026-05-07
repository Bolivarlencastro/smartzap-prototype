import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { SessionData } from '../models/session-data';
import { CoursesApi, ThemingService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CHECK_IN_STATUS } from '../models/check-in-error-code';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { SupportMaterialsService } from './support-materials.service';

@Injectable({
  providedIn: 'root',
})
export class CheckInService {
  readonly sessionData = signal<SessionData | undefined>(undefined);
  readonly destroyRef = inject(DestroyRef);
  readonly checkInStatus = signal<CHECK_IN_STATUS>('loading');
  readonly processingCheckIn = signal(true);

  constructor(
    private readonly themingService: ThemingService,
    private readonly coursesApi: CoursesApi,
    private readonly supportMaterialsService: SupportMaterialsService,
  ) {}

  setSessionData(sessionData: SessionData) {
    this.sessionData.set(sessionData);
    const workspaceColor = sessionData.workspaceColor ?? '#6b21a8';
    this.themingService.setThemeColor(workspaceColor, false);
  }

  autoCheckIn(eventDateId: string) {
    this.processingCheckIn.set(true);
    this.coursesApi
      .autoCheckIn(eventDateId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error),
      });
  }

  private handleSuccess() {
    this.checkInStatus.set('success');
    const eventId = this.sessionData()?.eventId;
    this.supportMaterialsService.loadSupportMaterials(eventId);
  }

  private handleError(error: HttpErrorResponse) {
    this.checkInStatus.set(error.error.detail);
  }
}
