import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportStatus, LatestReportFilter } from '../../interfaces';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { REPORTS_STATUSES, ReportStatusDirective } from '../latest-report-collection/report-status.directive';
import { format, isDate } from 'date-fns';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormField, MatSuffix, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDateRangeInput,
  MatStartDate,
  MatEndDate,
  MatDatepickerToggle,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'latest-reports-filter',
  templateUrl: './latest-reports-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSuffix,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatLabel,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
    MatDateRangePicker,
    ReportStatusDirective,
    NgClass,
    MatTooltip,
    TranslocoPipe,
    MatIconButton,
  ],
})
export class LatestReportsFilterComponent implements OnInit, OnDestroy {
  // Available report statuses to choose from
  readonly statuses: ReportStatus[];

  // Whether to show or not the reports creator filter input
  @Input() showCreatorInput = true;

  // Trigger for the filter menu
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  // Event emitted when the filter changes
  @Output() filterChange = new EventEmitter<LatestReportFilter>();

  // Filter FormGroup
  filterForm = new UntypedFormGroup({
    creatorName: new UntypedFormControl(),
    startDate: new UntypedFormControl(),
    endDate: new UntypedFormControl(),
  });

  // Min and max date used for the range picker
  minDate!: Date;
  maxDate!: Date;

  // Use to stop listening to value changes from the creator name FormControl
  private readonly componentDestroyed$ = new Subject<void>();

  constructor() {
    this.setRangePickerControlDates();
    this.statuses = LatestReportsFilterComponent.createStatuses();
  }

  private static createStatuses(): ReportStatus[] {
    return Object.keys(REPORTS_STATUSES).map((status) => ({
      name: status,
      active: false,
    }));
  }

  private static normalizeDate(date: Date | null): string | undefined {
    return isDate(date) ? format(date, 'yyyy-MM-dd') : undefined;
  }

  ngOnInit(): void {
    this.filterForm
      .get('creatorName')
      ?.valueChanges.pipe(debounceTime(200), takeUntil(this.componentDestroyed$))
      .subscribe(() => this.onFilter());
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  /**
   * Resets the filter values and closes the menu
   */
  resetFilter(): void {
    this.filterForm.reset();
    this.resetStatuses();
    // Closes the menu which calls the onFilter method and returns the empty filter
    this.menuTrigger.closeMenu();
  }

  /**
   * Emits the filter event
   */
  onFilter(): void {
    const { creatorName, startDate, endDate } = this.filterForm.getRawValue();

    const formattedEndDate = LatestReportsFilterComponent.normalizeDate(endDate);
    const filter: LatestReportFilter = {
      user_creator_name__ilike: creatorName,
      created__gte: LatestReportsFilterComponent.normalizeDate(startDate),
      created__lte: formattedEndDate ? formattedEndDate.concat('T23:59:59') : undefined,
      status__in: this.getActiveStatuses(),
      page: 1,
    };

    // Remove empty keys so the API won't return an error
    Object.keys(filter).forEach(
      (k) => !filter[k as keyof LatestReportFilter] && delete filter[k as keyof LatestReportFilter],
    );

    this.filterChange.emit(filter);
  }

  /**
   * Toggles the active status of the informed item
   * @param reportStatus
   */
  statusChanged(reportStatus: ReportStatus) {
    const selectedStatus = this.statuses.find((status) => status.name === reportStatus.name);
    if (selectedStatus) {
      selectedStatus.active = !selectedStatus.active;
    }
  }

  private getActiveStatuses(): string[] {
    const activeStatuses = this.statuses?.filter((status) => status.active).map((status) => status.name);
    if (activeStatuses?.length) {
      return activeStatuses;
    }
    return Object.keys(REPORTS_STATUSES);
  }

  private resetStatuses(): void {
    this.statuses.forEach((status) => (status.active = false));
  }

  private setRangePickerControlDates(): void {
    this.maxDate = new Date();
    this.minDate = new Date();
    // Limits the start date to the last 60 days
    this.minDate.setDate(this.minDate.getDate() - 60);
  }
}
