import { FormControl } from '@angular/forms';
import { LearningObjectType } from '@app/main/custom-sections/models/custom-sections';

interface FilterModel<S, T, B> {
  search?: S;
  provider?: T;
  mission_category?: T;
  language?: T;
  favorites?: B;
  managed?: B;
}

export type Filter = FilterModel<string, string[], boolean>;
export type FilterForm = FilterModel<FormControl<string>, FormControl<string[]>, FormControl<boolean>>;

export interface SectionContentsFilter extends Filter {
  page?: number;
  per_page?: number;
}

export type SectionFilterType = 'custom' | 'all-trails' | 'all-courses';

export const SECTION_FILTER_TYPE_MAP: Record<LearningObjectType, SectionFilterType> = {
  'HIGHLIGHT.LEARNING_TRAIL': 'custom',
  'HIGHLIGHT.LEARNING_TRAIL.ENROLLED': 'custom',
  'HIGHLIGHT.COURSE': 'custom',
  'HIGHLIGHT.COURSE.ENROLLED': 'custom',
  'HIGHLIGHT.EVENTS': 'custom',
  'HIGHLIGHT.EVENTS.ENROLLED': 'custom',
  COURSE: 'custom',
  'COURSE.ENROLLED': 'custom',
  'COURSE.ALL': 'all-courses',
  LEARNING_TRAIL: 'custom',
  'LEARNING_TRAIL.ENROLLED': 'custom',
  'LEARNING_TRAIL.ALL': 'all-trails',
};
