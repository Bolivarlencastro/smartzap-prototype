import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { LedListService } from '../../../services/led-list.service';
import { LedEnrollmentActivityActions } from '../actions';
import { ledEnrollmentActivityFeature } from '../features';

@Injectable()
export class LedEnrollmentActivityEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedEnrollmentActivityActions.init),
      concatLatestFrom(() => this.store.select(ledEnrollmentActivityFeature.selectCourseId)),
      filter(([{ courseId }, lastCourseId]) => courseId !== lastCourseId),
      map(([{ courseId }, _]) => LedEnrollmentActivityActions.fetchData({ courseId })),
    );
  });

  fetchData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LedEnrollmentActivityActions.fetchData),
      switchMap(({ courseId }) =>
        this.ledListService.getLedEnrollmentActivityData(courseId).pipe(
          map((data) => LedEnrollmentActivityActions.fetchDataSuccess({ data })),
          catchError(() => of(LedEnrollmentActivityActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly ledListService: LedListService,
    private readonly store: Store,
  ) {}
}
