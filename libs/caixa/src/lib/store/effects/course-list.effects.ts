import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs';
import { CourseListService } from '../../services/course-list.service';
import { CourseListActions } from '../actions';
import { courseListFeature } from '../features';

@Injectable()
export class CourseListEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly courseListService: CourseListService,
  ) {}

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.loadCourses, CourseListActions.init, CourseListActions.filterCourses),
      concatLatestFrom(() => this.store.select(courseListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.courseListService
          .getCourses(filter)
          .pipe(map((response) => CourseListActions.loadCoursesSuccess({ response }))),
      ),
    );
  });

  loadCoursesSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.loadCoursesSuccess),
      concatLatestFrom(() => this.store.select(courseListFeature.selectCourseIdToOpen)),
      filter(([_, courseId]) => !!courseId),
      map(([_, courseId]) => CourseListActions.getCourseToOpenDetails({ courseId })),
    );
  });

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.init),
      switchMap(() =>
        this.courseListService
          .getCategories()
          .pipe(map((categories) => CourseListActions.loadCategoriesSuccess({ categories }))),
      ),
    );
  });

  dispatchAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.dispatchAction),
      map(({ action }) => this.courseListService.dispatchAction(action)),
    );
  });

  manageQueryParamsToOpenCourse = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseListActions.manageQueryParamsToOpenCourse),
        tap(({ courseId }) => this.courseListService.manageQueryParams({ id: courseId })),
      );
    },
    { dispatch: false },
  );

  shareCourse = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseListActions.shareCourse),
        tap(({ courseId }) => this.courseListService.shareCourse(courseId)),
      );
    },
    { dispatch: false },
  );

  getCourseToOpenDetails = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.getCourseToOpenDetails),
      concatLatestFrom(({ courseId }) => this.store.select(courseListFeature.selectCourseById(courseId))),
      map(([{ courseId }, course]) => {
        if (course) {
          return CourseListActions.openCourseDetails({ course });
        }

        return CourseListActions.saveCourseIdToOpenDetails({ courseId });
      }),
    );
  });

  openCourseDetails = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseListActions.openCourseDetails),
        tap(() => this.courseListService.openCourseDetails()),
      );
    },
    { dispatch: false },
  );
}
