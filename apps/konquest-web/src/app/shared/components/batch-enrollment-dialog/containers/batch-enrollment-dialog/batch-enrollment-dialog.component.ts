import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BatchEnrollmentDialogViewModel } from '../../batch-enrollment-dialog-view-model';
import { batchEnrollmentFeature, BatchEnrollmentsActions } from '../../store';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CyclesActions, cyclesFeature } from 'app/shared/store';
import { AsyncPipe } from '@angular/common';
import { BatchEnrollmentDialogContentComponent } from '../batch-enrollment-dialog-content/batch-enrollment-dialog-content.component';
import { BatchEnrollmentActionsComponent } from '../../components/batch-enrollment-actions/batch-enrollment-actions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';
import { BatchEnrollmentDialogTitlePipe } from '../../pipes/batch-enrollment-dialog-title.pipe';

@Component({
  selector: 'app-batch-enrollment-dialog',
  template: `
    @if (viewModel$ | async; as vm) {
      <div mat-dialog-title class="font-bold flex justify-between items-center py-4">
        <span class="text-2xl flex-1" id="mission-batch-enrollments-title">
          {{ vm.type | batchEnrollmentDialogTitle | transloco }}
        </span>
      </div>
      <app-batch-enrollment-dialog-content></app-batch-enrollment-dialog-content>
      <mat-divider></mat-divider>
      <app-batch-enrollment-actions
        [submitDisabled]="vm.submitDisabled"
        [viewMode]="vm.viewMode"
        [cycles]="cycles$ | async"
        [isNormativeActive]="isNormativeActive$ | async"
        [enrollmentConfig]="vm.enrollmentConfig"
        [type]="vm.type"
        [reachedLimitSeats]="vm.reachedLimitSeats"
        [remainingSeats]="vm.remainingSeats"
        (setEnrollmentConfig)="setEnrollmentConfig($event)"
        (closeDialog)="closeDialog()"
        (enrollOthers)="enrollOthers($event)"
        (continue)="onContinue()"
        (enroll)="onEnroll()"
        (filterCycle)="filterCycle($event)"
        class="block border-t"
      ></app-batch-enrollment-actions>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    BatchEnrollmentDialogContentComponent,
    BatchEnrollmentActionsComponent,
    AsyncPipe,
    TranslocoPipe,
    MatDivider,
    BatchEnrollmentDialogTitlePipe,
  ],
})
export class BatchEnrollmentDialogComponent implements OnDestroy {
  viewModel$: Observable<BatchEnrollmentDialogViewModel>;
  cycles$: Observable<CycleDto[]>;
  isNormativeActive$: Observable<boolean>;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<BatchEnrollmentDialogComponent>,
  ) {
    this.viewModel$ = this.store.select(batchEnrollmentFeature.selectViewModel);
    this.cycles$ = this.store.select(cyclesFeature.selectAll);
    this.isNormativeActive$ = this.store.select(cyclesFeature.selectIsNormativeActive);
  }

  ngOnDestroy() {
    this.store.dispatch(BatchEnrollmentsActions.resetState());
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onEnroll() {
    this.store.dispatch(BatchEnrollmentsActions.batchEnrollment());
  }

  enrollOthers(resetState: boolean) {
    if (resetState) {
      this.store.dispatch(BatchEnrollmentsActions.backToEnrollList());
      return;
    }

    this.store.dispatch(BatchEnrollmentsActions.changeViewMode({ viewMode: 'list' }));
  }

  onContinue(): void {
    this.store.dispatch(BatchEnrollmentsActions.changeViewMode({ viewMode: 'resume' }));
  }

  setEnrollmentConfig(config: EnrollmentConfig) {
    this.store.dispatch(BatchEnrollmentsActions.setEnrollmentConfig({ config }));
  }

  filterCycle(search: string) {
    this.store.dispatch(CyclesActions.filterCycles({ search }));
  }
}
