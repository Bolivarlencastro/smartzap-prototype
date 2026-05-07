import { FormControl } from '@angular/forms';

interface SectionModel<S, D> {
  title: S;
  description: S;
  start_date: D;
  end_date: D;
}

export type Section = SectionModel<string, Date>;
export type SectionForm = SectionModel<FormControl<string>, FormControl<Date>>;
