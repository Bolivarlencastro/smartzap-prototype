import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CourseDialogService } from '../../../services/course-dialog.service';
import { CourseDialogActions } from '../actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { courseDialogFeature } from '../features';

@Injectable()
export class CourseDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseDialogActions.openDialog),
        tap(() => this.courseDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  fetchData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseDialogActions.fetchData),
      concatLatestFrom(() => this.store.select(courseDialogFeature.selectCourseId)),
      switchMap(([_, courseId]) =>
        this.courseDialogService.fetchData(courseId).pipe(
          map((data) => CourseDialogActions.fetchDataSuccess({ data })),
          catchError(() => of(CourseDialogActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly courseDialogService: CourseDialogService,
  ) {}
}
