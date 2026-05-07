import { FormControl } from '@angular/forms';

export interface EventManagementFilter {
  per_page?: string;
  search?: string;
  date_id?: string;
  presented?: boolean;
  paginate?: boolean;
}

export interface FilterForm {
  date_id: FormControl<string>;
  presented: FormControl<boolean>;
}
