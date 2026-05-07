import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardPeriodType } from '../../dashboard.model';
import { format, setMonth } from 'date-fns';

import { MatSlider, MatSliderThumb } from '@angular/material/slider';

@Component({
  selector: 'kp-slide-filter-range',
  templateUrl: './kp-slide-filter-range.component.html',
  imports: [MatSlider, MatSliderThumb],
})
export class KpSlideFilterRangeComponent {
  min = 0;
  max = 0;
  value = 0;

  isFilteredByMonth!: boolean;
  isFilteredByYear!: boolean;

  @Output()
  slideChanged = new EventEmitter<number>();

  @Input()
  set type(period: DashboardPeriodType) {
    this.isFilteredByMonth = period === DashboardPeriodType.MONTH;
    this.isFilteredByYear = period === DashboardPeriodType.YEAR;

    if (period === DashboardPeriodType.YEAR) {
      this.max = new Date().getFullYear();
      this.min = this.max - 10;
      this.value = this.max;
      return;
    }

    this.max = 12;
    this.min = 1;
    this.value = new Date().getMonth() + 1;
  }

  onChange(value: number): void {
    this.slideChanged.emit(value);
  }

  formatLabel(value: number): string {
    if (!value) {
      return '';
    }
    const date = setMonth(new Date(), value - 1);

    return format(date, 'MMM');
  }
}
