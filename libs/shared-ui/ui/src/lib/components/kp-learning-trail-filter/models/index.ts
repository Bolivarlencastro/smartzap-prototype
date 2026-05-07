import { FormControl } from '@angular/forms';

export interface LearningTrailModel<T> {
  languages: T;
}

export type LearningTrailFilter = LearningTrailModel<string[]>;
export type LearningTrailForm = LearningTrailModel<FormControl<string[]>>;
