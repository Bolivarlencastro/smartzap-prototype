import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoursesRouterModule } from './courses.router';
import { CourseEditGuard, CourseGuard, CoursesService, LessonsService } from './services';
import {
  CourseEffects,
  CoursesEffects,
  EnrollmentsEffects,
  LessonsEffects,
  TrackingEffects,
  UploadEffects,
} from './store/effects';
import { TransferEffects } from './store/effects/transfer.effects';
import * as fromCourses from './store/reducers';

const EFFECTS = [
  CoursesEffects,
  CourseEffects,
  UploadEffects,
  EnrollmentsEffects,
  LessonsEffects,
  TrackingEffects,
  TransferEffects,
];

@NgModule({
  imports: [
    CoursesRouterModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    // NGRX
    EffectsModule.forFeature(EFFECTS),
    StoreModule.forFeature(fromCourses.coursesFeatureKey, fromCourses.reducers),
  ],
  providers: [CoursesService, LessonsService, CourseGuard, CourseEditGuard],
})
export class CoursesModule {}
