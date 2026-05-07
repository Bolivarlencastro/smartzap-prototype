import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BatchEnrollmentDialogViewModel } from '../../batch-enrollment-dialog-view-model';
import { batchEnrollmentFeature, BatchEnrollmentsActions } from '../../store';
import { AsyncPipe } from '@angular/common';
import { BatchEnrollmentsListComponent } from '../../components/batch-enrollments-list/batch-enrollments-list.component';
import { BatchEnrollmentNotFoundListComponent } from '../../components/batch-enrollment-not-found-list/batch-enrollment-not-found-list.component';
import { BatchEnrollmentsResumeComponent } from '../../components/batch-enrollments-resume/batch-enrollments-resume.component';
import { KpEnrollmentSettingResumeComponent } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'app-batch-enrollment-dialog-content',
  template: `
    @if (viewModel$ | async; as vm) {
      @switch (vm.viewMode) {
        @default {
          <app-batch-enrollments-list
            [users]="vm.users"
            [selection]="vm.selectedIds"
            [selectionSize]="vm.selectionSize"
            [loading]="vm.isLoading"
            (searchChange)="onSearch($event)"
            (selectAllToggle)="onToggleAll($event)"
            (userSelectionToggle)="onSelectUser($event)"
            (loadMore)="loadMore()"
            (fileSelected)="selectViaFile($event)"
          ></app-batch-enrollments-list>
        }
        @case ('notFound') {
          <app-batch-enrollment-not-found-list [notFounds]="vm.notFounds"> </app-batch-enrollment-not-found-list>
        }
        @case ('resume') {
          <app-batch-enrollments-resume>
            <p class="mb-4 font-bold text-xl">
              {{ 'BATCH_ENROLLMENT.RESUME.WILL_ENROLL' | kpPluralizeTranslate: { value: vm.selectionSize } }}
            </p>
            @if (vm.enrollmentConfig) {
              <p>{{ 'BATCH_ENROLLMENT.RESUME.ENROLLMENT_CONFIGURATION' | transloco }}</p>
              <kp-enrollment-setting-resume [enrollmentConfig]="vm.enrollmentConfig"></kp-enrollment-setting-resume>
            }
          </app-batch-enrollments-resume>
        }
        @case ('finish') {
          <app-batch-enrollments-resume>
            <p class="mb-4 font-bold text-xl">
              @if (!vm.successfullyEnrolledTotal) {
                {{ 'BATCH_ENROLLMENT.FINISH.NONE_ENROLLED' | transloco }}
              } @else {
                {{
                  'BATCH_ENROLLMENT.FINISH.SUCCESSFULLY_ENROLLED'
                    | kpPluralizeTranslate: { value: vm.successfullyEnrolledTotal }
                }}
              }
            </p>
            <p>
              {{ 'BATCH_ENROLLMENT.FINISH.ENROLLED' | kpPluralizeTranslate: { value: vm.successfullyEnrolledTotal } }}
            </p>
            @if (vm.enrollmentConfig) {
              <kp-enrollment-setting-resume [enrollmentConfig]="vm.enrollmentConfig"></kp-enrollment-setting-resume>
            }
          </app-batch-enrollments-resume>
        }
      }
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BatchEnrollmentsListComponent,
    BatchEnrollmentNotFoundListComponent,
    BatchEnrollmentsResumeComponent,
    KpEnrollmentSettingResumeComponent,
    AsyncPipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class BatchEnrollmentDialogContentComponent {
  viewModel$: Observable<BatchEnrollmentDialogViewModel>;

  constructor(private store: Store) {
    this.viewModel$ = this.store.select(batchEnrollmentFeature.selectViewModel);
  }

  onSelectUser(userId: string): void {
    this.store.dispatch(BatchEnrollmentsActions.toggleSelectUser({ id: userId }));
  }

  onToggleAll(selected: boolean) {
    this.store.dispatch(BatchEnrollmentsActions.toggleSelectAll({ selected }));
  }

  selectViaFile(file: File) {
    this.store.dispatch(BatchEnrollmentsActions.parseUsers({ file }));
  }

  loadMore() {
    this.store.dispatch(BatchEnrollmentsActions.loadMoreUsers());
  }

  onSearch(filter: string) {
    this.store.dispatch(BatchEnrollmentsActions.filterUsers({ filter }));
  }
}
