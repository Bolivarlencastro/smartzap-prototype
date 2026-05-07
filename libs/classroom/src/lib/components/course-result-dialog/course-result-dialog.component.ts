import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, race, timer } from 'rxjs';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { TranslocoPipe } from '@jsverse/transloco';
import { ResultDialogConfig } from '../../services/course/confirmation-dialog-strategies';
import { CourseActions } from '../../store/actions';
import { classroomCourseFeature } from '../../store/features';

@Component({
  selector: 'kp-course-result-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    MatButton,
    MatProgressSpinner,
    TranslocoPipe,
    KpPerformancePipe,
    KpDurationPipe,
    DecimalPipe,
  ],
  templateUrl: './course-result-dialog.component.html',
  styleUrl: './course-result-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseResultDialogComponent {
  protected data = inject<ResultDialogConfig>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CourseResultDialogComponent>);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);

  protected loading = signal(false);

  get minPerformance(): number {
    return this.data?.course?.minimum_performance || this.data?.course?.workspace_min_performance;
  }

  close() {
    if (!this.data?.approved) {
      this.dialogRef.close(true);
      return;
    }

    this.loading.set(true);
    this.store.dispatch(CourseActions.loadCertificate());

    race(
      this.store.select(classroomCourseFeature.selectCertificateUrl).pipe(filter(Boolean)),
      this.actions$.pipe(ofType(CourseActions.loadCertificateFailure)),
      timer(30_000),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close(true));
  }
}
