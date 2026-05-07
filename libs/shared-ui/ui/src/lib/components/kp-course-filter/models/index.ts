import { FormControl } from '@angular/forms';

export interface CourseModel<T, S> {
  languages: T;
  missionModels: T;
  categories: T;
  providers: T;
  minimum_performance__gte: S;
  minimum_performance__lte: S;
}

export type CourseFilter = CourseModel<string[], string>;
export type CourseForm = CourseModel<FormControl<string[]>, FormControl<string>>;
