import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  KpFilterContainerComponent,
  KpFilterController,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EvaluationsFilterState } from '../../store/reducers/evaluations-filter.reducer';
import { EvaluationsFilterSelectors } from '../../store/selectors';
import { evaluationsFilterOptions } from './evaluations-filter-modal-options';
import { EvaluationsFilterResult } from './models';
import { format, isDate } from 'date-fns';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-evaluations-filter-modal',
  templateUrl: './evaluations-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    KpFilterContainerComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class EvaluationsFilterModalComponent {
  protected missionId: string;
  protected filterOptions = evaluationsFilterOptions;
  protected readonly viewModel$: Observable<EvaluationsFilterState>;

  filterFormGroup = new UntypedFormGroup({});

  @ViewChild(KpFilterController) private filterController: KpFilterController;

  constructor(
    private _dialogRef: MatDialogRef<EvaluationsFilterModalComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.viewModel$ = this.store.select(EvaluationsFilterSelectors.selectViewModel);
    this.missionId = data.id;
  }

  onFilter(): void {
    const formValue = this.filterFormGroup.getRawValue();
    const filter = {
      mission__id: this.missionId,
      ...(formValue.created_date && {
        created_date: this.formatDate(formValue.created_date),
      }),
      ...(formValue.created_date__gte && {
        created_date__gte: this.formatDate(formValue.created_date__gte),
      }),
      ...(formValue.created_date__lte && {
        created_date__lte: this.formatDate(formValue.created_date__lte),
      }),
      ...(formValue.sentiment_analysis && {
        sentiment_analysis: formValue.sentiment_analysis,
      }),
    };

    const result: EvaluationsFilterResult = {
      filter,
      controllerState: this.filterController.getControllerState(),
    };
    this._dialogRef.close(result);
  }

  clearFilter() {
    this.filterController.resetSelection();
  }

  private formatDate(date: Date | string): string {
    if (!isDate(date)) {
      return date as string;
    }
    return format(date as Date, 'yyyy-MM-dd');
  }
}
