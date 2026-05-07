import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  KpFilterContainerComponent,
  KpFilterController,
  KpFilterOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface UsersConsumptionFilterResult {
  status?: string[];
  concluded_after?: Date | null;
  concluded_before?: Date | null;
}

@Component({
  selector: 'app-users-consumption-filter-dialog',
  templateUrl: './users-consumption-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslocoPipe,
    KpFilterContainerComponent,
  ],
})
export class UsersConsumptionFilterDialogComponent {
  @ViewChild(KpFilterController) private readonly filterController: KpFilterController;

  protected readonly filterOptions: KpFilterOption[];
  protected readonly filterFormGroup = new FormGroup({});

  constructor(
    private readonly dialogRef: MatDialogRef<UsersConsumptionFilterDialogComponent>,
    private readonly transloco: TranslocoService,
  ) {
    this.filterOptions = this.buildFilterOptions();
  }

  clearFilter(): void {
    this.filterController.resetSelection();
  }

  onSubmit(): void {
    this.dialogRef.close(this.filterFormGroup.getRawValue());
  }

  private buildFilterOptions(): KpFilterOption[] {
    const t = (key: string) => this.transloco.translate(key);

    return [
      {
        filterKey: 'status',
        label: t('GENERAL.STATUS'),
        type: 'selectMultiple',
        options: [
          { value: 'COMPLETED', label: t('STATUS.COMPLETED') },
          { value: 'STARTED', label: t('STATUS.STARTED') },
          { value: 'REFUSED', label: t('STATUS.REFUSED') },
          { value: 'WAITING', label: t('STATUS.WAITING') },
          { value: 'CANCELED', label: t('STATUS.CANCELED') },
        ],
      },
      {
        filterKey: 'concluded',
        label: t('SETTINGS.ENROLLMENTS.FILTER.END_DATE'),
        type: 'dateRange',
        rangeConfig: {
          fromKey: 'concluded_after',
          toKey: 'concluded_before',
        },
        rangeOptions: ['less', 'more', 'between'],
      },
    ];
  }
}
