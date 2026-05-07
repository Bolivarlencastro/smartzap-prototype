import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { CreationService } from '../../services/creation.service';
import { CreationActions } from '../actions';
import { creationFeature } from '../features';

@Injectable()
export class CreationEffects {
  loadData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.loadData),
      switchMap(() =>
        this.creationService.fetchTemplates().pipe(
          map((templates) => CreationActions.loadDataSuccess({ templates })),
          catchError(() => of(CreationActions.loadDataFailure())),
        ),
      ),
    );
  });

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.loadCourses),
      concatLatestFrom(() => this.store.select(creationFeature.selectCoursesFilter)),
      switchMap(([_, filter]) =>
        this.creationService
          .fetchCourses(filter)
          .pipe(map((courses) => CreationActions.loadCoursesSuccess({ courses }))),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly creationService: CreationService,
    private readonly store: Store,
  ) {}
}
