import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { format } from 'date-fns';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatIcon } from '@angular/material/icon';

import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';

type StatusItem = {
  status: string;
  label: string;
  selected?: boolean;
};

@Component({
  selector: 'app-enrollment-filter',
  templateUrl: './enrollment-filter.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    KpStatusChipComponent,
    MatTooltip,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatButton,
    TranslocoPipe,
    KpEnrollmentStatusColorPipe,
  ],
})
export class EnrollmentFilterComponent {
  @Output() filter: EventEmitter<EnrollmentFilter> = new EventEmitter();
  form: UntypedFormGroup;
  availableStatuses: StatusItem[] = [
    { status: 'COMPLETED', label: 'STATUS.COMPLETED' },
    { status: 'STARTED', label: 'STATUS.STARTED' },
    { status: 'REFUSED', label: 'STATUS.REFUSED' },
    { status: 'WAITING', label: 'STATUS.WAITING' },
    { status: 'CANCELED', label: 'STATUS.CANCELED' },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      start_date__gte: [],
      end_date__lte: [],
      performance__gte: [undefined, [Validators.min(0), Validators.max(100)]],
      performance__lte: [undefined, [Validators.min(0), Validators.max(100)]],
      search: [undefined, Validators.minLength(3)],
      status__in: [[]],
    });
  }

  get selectedStatuses(): string[] {
    return this.form.get('status__in')?.value;
  }

  onSelectStatus(chip: StatusItem): void {
    chip.selected = !chip.selected;

    const statusesControl = this.form.get('status__in') as UntypedFormControl;
    const currentStatuses = statusesControl.value;
    const statuses = chip.selected
      ? [chip.status, ...currentStatuses]
      : currentStatuses.filter((status: string) => status !== chip.status);
    statusesControl.setValue(statuses);
    this.handleSubmit();
  }

  handleClear(): void {
    this.form.patchValue({
      start_date__gte: undefined,
      end_date__lte: undefined,
      performance__gte: undefined,
      performance__lte: undefined,
      search: undefined,
      status__in: [],
    });
    this.availableStatuses.forEach((status) => (status.selected = false));
    this.handleSubmit();
  }

  handleSubmit(): void {
    if (!this.form.valid) return;
    const filter: EnrollmentFilter = {};
    const { status__in, start_date__gte, end_date__lte, performance__gte, performance__lte, search } =
      this.form.getRawValue();

    if (Array.isArray(status__in) && status__in.length) filter.status__in = status__in.join(',');
    if (start_date__gte) filter.start_date__gte = format(start_date__gte, 'yyyy-MM-dd');
    if (end_date__lte) filter.end_date__lte = format(end_date__lte, 'yyyy-MM-dd');
    if (!KeepsUtils.isNil(performance__gte)) filter.performance__gte = (performance__gte / 100).toString();
    if (!KeepsUtils.isNil(performance__lte)) filter.performance__lte = (performance__lte / 100).toString();
    if (!KeepsUtils.isNil(search)) filter.search = search;
    this.filter.emit(filter);
  }
}
