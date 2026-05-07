import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ScormService } from '../../services';
import { ScormCMIActions } from '../actions';
import { concatLatestFrom } from '@ngrx/operators';
import { of, switchMap } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { classroomCourseFeature, classroomScormFeature, classroomStepsFeature } from '../features';

@Injectable()
export class ScormCmiEffects {
  loadScormCMI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScormCMIActions.loadScormCMI),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomStepsFeature.selectCurrentStep),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      filter(([_, course]) => !!course),
      switchMap(([_, course, currentStep, isViewingAsUser]) =>
        this.scormService
          .fetch({
            viewingAsUser: isViewingAsUser,
            enrollmentId: course.enrollment?.id,
            missionStageContentId: currentStep.id,
          })
          .pipe(
            map((cmi) => ScormCMIActions.loadScormCMISuccess({ cmi })),
            catchError((error) => of(ScormCMIActions.loadScormCMIFailure({ error }))),
          ),
      ),
    );
  });

  saveScormCMI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScormCMIActions.saveScormCMI),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomStepsFeature.selectCurrentStep),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      filter(([_, course]) => !!course),
      switchMap(([{ cmi }, course, currentStep, isViewingAsUser]) =>
        this.scormService
          .save(
            {
              viewingAsUser: isViewingAsUser,
              enrollmentId: course.enrollment?.id,
              missionStageContentId: currentStep.id,
            },
            cmi,
          )
          .pipe(
            map((cmi) => ScormCMIActions.saveScormCMISuccess({ cmi })),
            catchError((error) => of(ScormCMIActions.saveScormCMIFailure({ error }))),
          ),
      ),
    );
  });

  saveLastEmittedScormCMI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScormCMIActions.saveLastEmittedScormCMI),
      concatLatestFrom(() => [
        this.store.select(classroomScormFeature.selectLastEmittedCMI),
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomStepsFeature.selectCurrentStep),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      filter(([_, cmi]) => !!cmi),
      switchMap(([_, cmi, course, currentStep, isViewingAsUser]) =>
        this.scormService
          .save(
            {
              viewingAsUser: isViewingAsUser,
              enrollmentId: course.enrollment?.id,
              missionStageContentId: currentStep.id,
            },
            cmi,
          )
          .pipe(
            map((cmi) => ScormCMIActions.saveScormCMISuccess({ cmi })),
            catchError((error) => of(ScormCMIActions.saveScormCMIFailure({ error }))),
          ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private scormService: ScormService,
    private store: Store,
  ) {}
}
