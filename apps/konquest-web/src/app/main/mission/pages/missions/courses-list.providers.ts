import { importProvidersFrom } from '@angular/core';
import { FEATURE_EFFECTS, missionsFeature } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CourseListService } from './services/course-list.service';

export const COURSES_LIST_PROVIDERS = [
  CourseListService,
  importProvidersFrom(StoreModule.forFeature(missionsFeature), EffectsModule.forFeature(FEATURE_EFFECTS)),
];
