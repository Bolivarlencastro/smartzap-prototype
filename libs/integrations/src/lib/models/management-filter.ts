import { FormControl } from '@angular/forms';

export interface ManagementFilterModel<S, D> {
  category: S;
  status: S;
  created_date_gte: D;
  created_date_lte: D;
}

export type ManagementFilter = Partial<ManagementFilterModel<string[], Date>>;
export type ManagementFilterForm = Partial<ManagementFilterModel<FormControl<string[]>, FormControl<Date>>>;
