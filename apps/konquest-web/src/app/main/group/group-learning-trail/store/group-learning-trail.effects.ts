import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as GroupLearningTrailActions from './group-learning-trail.actions';
import { GroupLearningTrailAPI } from '../group-learning-trail.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
@Injectable()
export class GroupLearningTrailEffects {
  loadGroupMissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupLearningTrailActions.loadGroupLearningTrails, GroupLearningTrailActions.filterGroupLearningTrails),
      switchMap(({ id, queryParams }) =>
        this.service.fetchByQuery(id, queryParams).pipe(
          map((data) => GroupLearningTrailActions.loadGroupLearningTrailsSuccess({ data })),
          catchError((error) =>
            of(
              GroupLearningTrailActions.loadGroupLearningTrailsFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  addMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupLearningTrailActions.addGroupLearningTrails),
      switchMap(({ data }) =>
        this.service.addMany(data).pipe(
          tap((data) => this._errorHandlerService.showImportEnrollmentsErrorDialog(data)),
          map(() =>
            GroupLearningTrailActions.filterGroupLearningTrails({
              id: data.groupId,
              queryParams: { page: 1, per_page: 10 },
            }),
          ),
          catchError((error) =>
            of(
              GroupLearningTrailActions.loadGroupLearningTrailsFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupLearningTrailActions.deleteGroupLearningTrail),
      switchMap(({ groupId, learningTrailId }) =>
        this.service.delete(groupId, learningTrailId).pipe(
          map(() => GroupLearningTrailActions.deleteGroupLearningTrailSuccess()),
          catchError((error) =>
            of(
              GroupLearningTrailActions.loadGroupLearningTrailsFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: GroupLearningTrailAPI,
    private _errorHandlerService: GenericErrorHandlerService,
  ) {}
}
