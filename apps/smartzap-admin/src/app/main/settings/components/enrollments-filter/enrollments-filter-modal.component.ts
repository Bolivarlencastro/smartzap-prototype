import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { format } from 'date-fns';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';

type StatusItem = {
  status: string;
  label: string;
  selected?: boolean;
};

@Component({
  selector: 'app-settings-enrollments-filter-modal',
  templateUrl: './enrollments-filter-modal.component.html',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    MatDialogContent,
    MatDivider,
    MatTooltip,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    KpStatusChipComponent,
    KpEnrollmentStatusColorPipe,
  ],
})
export class EnrollmentsFilterModalComponent {
  form: UntypedFormGroup;
  availableStatuses: StatusItem[];

  get dateRange(): { start: UntypedFormControl; end: UntypedFormControl } {
    return {
      start: this.form.get('start_date__gte') as UntypedFormControl,
      end: this.form.get('end_date__lte') as UntypedFormControl,
    };
  }

  get selectedStatuses(): string[] {
    return this.form.get('status__in')?.value ?? [];
  }

  constructor(
    private readonly dialogRef: MatDialogRef<EnrollmentsFilterModalComponent>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly data: { filters: EnrollmentFilter },
  ) {
    this.form = this.formBuilder.group({
      start_date__gte: [],
      end_date__lte: [],
      performance__gte: [undefined, [Validators.min(0), Validators.max(100)]],
      performance__lte: [undefined, [Validators.min(0), Validators.max(100)]],
      status__in: [[]],
    });
    this.availableStatuses = [
      { status: 'COMPLETED', label: 'STATUS.COMPLETED' },
      { status: 'STARTED', label: 'STATUS.STARTED' },
      { status: 'WAITING', label: 'STATUS.WAITING' },
      { status: 'REFUSED', label: 'STATUS.REFUSED' },
      { status: 'CANCELED', label: 'STATUS.CANCELED' },
    ];

    this.patchForm(data.filters);
  }

  onSelectStatus(chip: StatusItem): void {
    chip.selected = !chip.selected;

    const statusesControl = this.form.get('status__in') as UntypedFormControl;
    const currentStatuses = statusesControl.value ?? [];
    const statuses = chip.selected
      ? [chip.status, ...currentStatuses]
      : currentStatuses.filter((status: string) => status !== chip.status);
    statusesControl.setValue(statuses);
  }

  onClear(): void {
    this.dialogRef.close({});
  }

  onApply(): void {
    if (!this.form.valid) return;

    const filter: EnrollmentFilter = {};
    const { status__in, start_date__gte, end_date__lte, performance__gte, performance__lte } = this.form.getRawValue();

    if (Array.isArray(status__in) && status__in.length) filter.status__in = status__in.join(',');
    if (start_date__gte) filter.start_date__gte = format(start_date__gte, 'yyyy-MM-dd');
    if (end_date__lte) filter.end_date__lte = format(end_date__lte, 'yyyy-MM-dd');
    if (!KeepsUtils.isNil(performance__gte)) filter.performance__gte = (performance__gte / 100).toString();
    if (!KeepsUtils.isNil(performance__lte)) filter.performance__lte = (performance__lte / 100).toString();

    this.dialogRef.close(filter);
  }

  private patchForm(filters: EnrollmentFilter): void {
    const selectedStatuses = filters.status__in?.split(',').filter(Boolean) ?? [];

    this.form.patchValue({
      start_date__gte: filters.start_date__gte ? new Date(filters.start_date__gte) : undefined,
      end_date__lte: filters.end_date__lte ? new Date(filters.end_date__lte) : undefined,
      performance__gte: filters.performance__gte ? Number(filters.performance__gte) * 100 : undefined,
      performance__lte: filters.performance__lte ? Number(filters.performance__lte) * 100 : undefined,
      status__in: selectedStatuses,
    });

    this.availableStatuses = this.availableStatuses.map((status) => ({
      ...status,
      selected: selectedStatuses.includes(status.status),
    }));
  }
}
