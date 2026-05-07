import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { KpDateRangeFilterV2Component } from '../kp-range-filter';
import { ChartFilterForm, ChartFilterModel, ChartFilterPeriod } from './models';

@Component({
  selector: 'kp-analytics-chart-filter',
  imports: [
    TranslocoModule,
    MatButtonToggleModule,
    MatIconModule,
    KpDateRangeFilterV2Component,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './kp-analytics-chart-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpAnalyticsChartFilterComponent {
  @ViewChild('customFilter') customFilter: KpDateRangeFilterV2Component;
  @Output() filter = new EventEmitter<ChartFilterModel>();

  filterForm: FormGroup<ChartFilterForm>;
  chartFilterPeriod = ChartFilterPeriod;
  filterPeriodType = ChartFilterPeriod.ALL;
  maxDate = new Date();

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.buildFilterForm(formBuilder);
  }

  onCustomFilter(): void {
    const { start_date, end_date } = this.filterForm.value;

    if (!start_date && !end_date) {
      this.filterPeriodType = ChartFilterPeriod.ALL;
      this.onFilterByPeriod();
      return;
    }

    this.filter.emit({ ...(!!start_date && { start_date }), ...(!!end_date && { end_date }) });
    this.filterPeriodType = null;
  }

  onFilterByPeriod(): void {
    this.customFilter.cleanFilter();
    const today = new Date();
    const map = new Map<ChartFilterPeriod, ChartFilterModel>([
      [ChartFilterPeriod.ALL, {}],
      [ChartFilterPeriod.THIRTY_DAYS, { start_date: this.getStartDateForPeriod(today, 30), end_date: today }],
      [ChartFilterPeriod.SIXTY_DAYS, { start_date: this.getStartDateForPeriod(today, 60), end_date: today }],
    ]);

    this.filter.emit(map.get(this.filterPeriodType));
  }

  private getStartDateForPeriod(today: Date, days: number): Date {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    return startDate;
  }

  private buildFilterForm(fb: FormBuilder): FormGroup {
    return fb.group({
      start_date: null,
      end_date: null,
    });
  }
}
