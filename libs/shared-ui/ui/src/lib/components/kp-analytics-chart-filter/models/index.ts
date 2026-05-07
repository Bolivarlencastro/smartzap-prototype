import { FormControl } from '@angular/forms';

export enum ChartFilterPeriod {
  ALL = 'ALL',
  THIRTY_DAYS = 'THIRTY_DAYS',
  SIXTY_DAYS = 'SIXTY_DAYS',
}

export interface ChartFilter<T> {
  start_date: T;
  end_date: T;
}

export type ChartFilterForm = Partial<ChartFilter<FormControl<Date>>>;
export type ChartFilterModel = Partial<ChartFilter<Date>>;
