import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  CourseService,
  DefaultNavigationStrategy,
  StepsNavigationService,
  SubjectNavigationStrategy,
} from './services';
import {
  ActivityEffects,
  ClassroomThemeEffects,
  ContentEffects,
  CourseEffects,
  EvaluationEffects,
  ExamEffects,
  ScormCmiEffects,
  StepEffectsV2,
  StepNavigationEffects,
} from './store/effects';
import {
  classroomActivityFeature,
  classroomContentFeature,
  classroomCourseFeature,
  classroomEvaluationFeature,
  classroomExamFeature,
  classroomScormFeature,
  classroomStepsFeature,
  classroomThemeFeature,
} from './store/features';
import { getTranslocoScope } from './transloco-scope.factory';

const SERVICES = [CourseService, StepsNavigationService];

const EFFECTS = [
  ClassroomThemeEffects,
  CourseEffects,
  StepEffectsV2,
  StepNavigationEffects,
  ContentEffects,
  ActivityEffects,
  ScormCmiEffects,
  ExamEffects,
  EvaluationEffects,
];

const ROUTE_NAVIGATION_STRATEGIES = [
  DefaultNavigationStrategy,
  SubjectNavigationStrategy,
  { provide: 'SUBJECT', useExisting: SubjectNavigationStrategy },
];

export const CLASSROOM_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature([...EFFECTS]),
    StoreModule.forFeature(classroomThemeFeature),
    StoreModule.forFeature(classroomCourseFeature),
    StoreModule.forFeature(classroomStepsFeature),
    StoreModule.forFeature(classroomContentFeature),
    StoreModule.forFeature(classroomActivityFeature),
    StoreModule.forFeature(classroomScormFeature),
    StoreModule.forFeature(classroomExamFeature),
    StoreModule.forFeature(classroomEvaluationFeature),
  ),
  ...SERVICES,
  ...ROUTE_NAVIGATION_STRATEGIES,
  getTranslocoScope(),
];
