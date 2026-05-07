import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StepsService } from '../../services';
import { CourseActions, CourseStepActions } from '../actions';
import { classroomCourseFeature } from '../features';

@Injectable()
export class StepEffectsV2 {
  loadSteps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadCourseSuccess),
      concatLatestFrom(() => this.store.select(classroomCourseFeature.selectIsViewingAsUser)),
      switchMap(([{ course }, isViewingAsUser]) =>
        this.stepsService.loadCourseSteps(course, isViewingAsUser).pipe(
          map((steps) => CourseStepActions.loadStepsSuccess({ steps })),
          catchError((error) => of(CourseStepActions.loadStepsFailure({ error }))),
        ),
      ),
    );
  });

  completeStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseStepActions.completeStep),
      concatLatestFrom(() => this.store.select(classroomCourseFeature.selectCourse)),
      switchMap(([{ step }, course]) =>
        this.stepsService.completeStep(step, course).pipe(
          map((completed) => CourseStepActions.completeStepSuccess({ step, skipped: !completed })),
          catchError((error) => of(CourseStepActions.completeStepFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private stepsService: StepsService,
    private store: Store,
  ) {}
}
