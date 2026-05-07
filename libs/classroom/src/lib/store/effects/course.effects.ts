import { Injectable } from '@angular/core';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { CourseService } from '../../services';
import { CourseActions } from '../actions';
import { classroomCourseFeature } from '../features';

@Injectable()
export class CourseEffects {
  loadCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadCourse),
      switchMap(({ courseId }) =>
        this.courseService.loadCourse(courseId).pipe(
          tap({ next: (course) => this.courseService.showWarningIfInactive(course) }),
          map((course) => CourseActions.loadCourseSuccess({ course })),
          catchError((error) => of(CourseActions.loadCourseFailure({ error }))),
        ),
      ),
    );
  });

  loadGamification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadCourse),
      switchMap(() =>
        this.courseService
          .loadGamification()
          .pipe(map((hasGamification) => CourseActions.loadGamification({ hasGamification }))),
      ),
    );
  });

  openLeaveConfirmationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.openLeaveConfirmationDialog),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      switchMap(([_, course, isViewingAsUser]) =>
        this.courseService.openLeaveConfirmationDialog(course, isViewingAsUser),
      ),
      filter((result) => !!result),
      map(() => CourseActions.leaveCourse()),
    );
  });

  leaveCourse$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.leaveCourse),
        concatLatestFrom(() => [
          this.store.select(classroomCourseFeature.selectCourse),
          this.store.select(classroomCourseFeature.selectRollbackPath),
        ]),
        tap(([_, course, rollbackPath]) => this.courseService.leaveCourse(course.id, rollbackPath)),
      );
    },
    { dispatch: false },
  );

  openFinishConfirmationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.openFinishCourseConfirmationDialog),
      switchMap(() => this.courseService.openFinishConfirmationDialog()),
      filter((result) => !!result),
      map(() => CourseActions.finishCourse()),
    );
  });

  finishCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.finishCourse),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomCourseFeature.selectHasGamification),
      ]),
      switchMap(([_, course, hasGamification]) =>
        this.courseService.finishEnrollment(course).pipe(
          map((enrollmentResult) => CourseActions.finishCourseSuccess({ enrollmentResult, course, hasGamification })),
          catchError((error) => of(CourseActions.finishCourseFailure({ error }))),
        ),
      ),
    );
  });

  enrollmentApproved$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.finishCourseSuccess),
      filter(({ enrollmentResult }) => enrollmentResult.enrollment.status === EnrollmentStatuses.COMPLETED),
      switchMap(({ enrollmentResult, course, hasGamification }) =>
        this.courseService.openCourseResultDialog(true, enrollmentResult?.resume, course, hasGamification),
      ),
      map(() => CourseActions.navigateToCertificate()),
    );
  });

  enrollmentReproved$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.finishCourseSuccess),
      filter(({ enrollmentResult }) => enrollmentResult.enrollment.status === EnrollmentStatuses.REPROVED),
      switchMap(({ enrollmentResult, course, hasGamification }) =>
        this.courseService.openCourseResultDialog(false, enrollmentResult?.resume, course, hasGamification),
      ),
      map(() => CourseActions.leaveCourse()),
    );
  });

  navigateToCertificate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.navigateToCertificate),
        concatLatestFrom(() => this.store.select(classroomCourseFeature.selectCourse)),
        tap(([_, course]) => this.courseService.navigateToCertificate(course.id)),
      );
    },
    { dispatch: false },
  );

  loadCertificate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadCertificate),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectEnrollment),
        this.store.select(classroomCourseFeature.selectCertificateUrl),
      ]),
      filter(([_, _enrollment, certificateUrl]) => !certificateUrl),
      switchMap(([_, enrollment]) =>
        this.courseService.loadCertificate(enrollment.id).pipe(
          map(({ certificate_url }) => CourseActions.loadCertificateSuccess({ certificateUrl: certificate_url })),
          catchError((error) => of(CourseActions.loadCertificateFailure({ error }))),
        ),
      ),
    );
  });

  shareCertificate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.shareCertificate),
        concatLatestFrom(() => this.store.select(classroomCourseFeature.selectCourse)),
        tap(([_, course]) => this.courseService.shareCertificate(course.name)),
      );
    },
    { dispatch: false },
  );

  updateGoalDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.updateGoalDate),
      filter(({ date }) => !!date),
      concatLatestFrom(() => this.store.select(classroomCourseFeature.selectCourse)),
      switchMap(([{ date }, course]) =>
        this.courseService
          .updateGoalDate(course.enrollment.id, date)
          .pipe(map(() => CourseActions.updateGoalDateSuccess({ date }))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private courseService: CourseService,
    private store: Store,
  ) {}
}
