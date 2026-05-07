import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { debounceTime } from 'rxjs';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { format } from 'date-fns';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  KpDateRangeFilterV2Component,
  KpPercentageRangeFilterComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-range-filter';

const parseFilterDate = (value?: string): Date | null => (value ? new Date(`${value}T00:00:00`) : null);

@Component({
  selector: 'app-settings-enrollments-filter',
  templateUrl: './enrollments-filter.component.html',
  imports: [
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatIcon,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    KpDateRangeFilterV2Component,
    KpPercentageRangeFilterComponent,
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentsFilterComponent implements OnInit {
  readonly filters = input<EnrollmentFilter>({});
  readonly filterEvent = output<EnrollmentFilter>();

  protected readonly availableStatuses = [
    { value: 'COMPLETED', label: 'STATUS.COMPLETED' },
    { value: 'STARTED', label: 'STATUS.STARTED' },
    { value: 'WAITING', label: 'STATUS.WAITING' },
    { value: 'REFUSED', label: 'STATUS.REFUSED' },
    { value: 'CANCELED', label: 'STATUS.CANCELED' },
  ];

  protected readonly form = new FormGroup({
    status__in: new FormControl<string[]>([]),
    start_date__gte: new FormControl<Date | null>(null),
    end_date__lte: new FormControl<Date | null>(null),
    performance__gte: new FormControl<number | null>(null, [Validators.min(0), Validators.max(100)]),
    performance__lte: new FormControl<number | null>(null, [Validators.min(0), Validators.max(100)]),
  });

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const initial = this.filters();
    this.form.patchValue(
      {
        status__in: initial?.status__in?.split(',').filter(Boolean) ?? [],
        start_date__gte: parseFilterDate(initial?.start_date__gte),
        end_date__lte: parseFilterDate(initial?.end_date__lte),
        performance__gte: initial?.performance__gte ? Number(initial.performance__gte) * 100 : null,
        performance__lte: initial?.performance__lte ? Number(initial.performance__lte) * 100 : null,
      },
      { emitEvent: false },
    );

    this.form.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe((formValue) => {
      if (!this.form.valid) return;

      const filter: EnrollmentFilter = {};
      const { status__in, start_date__gte, end_date__lte, performance__gte, performance__lte } = formValue;

      if (status__in?.length) filter.status__in = status__in.join(',');
      if (start_date__gte) filter.start_date__gte = format(start_date__gte, 'yyyy-MM-dd');
      if (end_date__lte) filter.end_date__lte = format(end_date__lte, 'yyyy-MM-dd');
      if (!KeepsUtils.isNil(performance__gte)) filter.performance__gte = (performance__gte / 100).toString();
      if (!KeepsUtils.isNil(performance__lte)) filter.performance__lte = (performance__lte / 100).toString();

      this.filterEvent.emit(filter);
    });
  }
}
