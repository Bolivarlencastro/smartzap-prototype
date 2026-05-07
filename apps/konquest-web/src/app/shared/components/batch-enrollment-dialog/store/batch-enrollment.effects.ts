import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { BatchEnrollmentService } from 'app/shared/services/batch-enrollment.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as BatchEnrollmentActions from './batch-enrollment.actions';
import { batchEnrollmentFeature } from './batch-enrollments.feature';
import { CyclesActions } from 'app/shared/store';
import { MissionDetailActions } from '@app/main/mission/pages/mission-detail-v2/store';

@Injectable()
export class BatchEnrollmentEffects {
  openBatchEnrollmentsDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.openDialog),
      switchMap(({ learningContentId, enrollmentType }) => {
        return this._batchEnrollmentService.openDialog().pipe(
          concatLatestFrom(() => this.store.select(batchEnrollmentFeature.selectHasCreatedEnrollments)),
          filter(([_, hasCreatedEnrollments]) => !!hasCreatedEnrollments),
          map(() =>
            BatchEnrollmentActions.batchEnrollmentFinished({
              learningContentId,
              enrollmentType,
            }),
          ),
        );
      }),
    );
  });

  batchEnrollment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.batchEnrollment),
      concatLatestFrom(() => [
        this.store.select(batchEnrollmentFeature.selectLearningContentId),
        this.store.select(batchEnrollmentFeature.selectSelectedIds),
        this.store.select(batchEnrollmentFeature.selectEnrollmentType),
        this.store.select(batchEnrollmentFeature.selectEnrollmentConfig),
      ]),
      mergeMap(([_, learnContentId, selectedIds, enrollmentType, enrollmentConfig]) => {
        const requestPayload = BatchEnrollmentService.buildEnrollmentRequesPayload(
          learnContentId,
          selectedIds,
          enrollmentType,
          enrollmentConfig,
        );

        return this._batchEnrollmentService.batch(requestPayload, enrollmentType).pipe(
          tap((response) => this._groupErrorHandlerService.showImportEnrollmentsErrorDialog(response)),
          map((response) =>
            BatchEnrollmentActions.batchEnrollmentSuccess({
              enrollmentErrors: BatchEnrollmentService.countErrors(response),
            }),
          ),
          catchError((error) => of(BatchEnrollmentActions.batchEnrollmentFailure({ error }))),
        );
      }),
    );
  });

  batchEnrollEventSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.batchEnrollmentSuccess),
      concatLatestFrom(() => this.store.select(batchEnrollmentFeature.selectEnrollmentType)),
      filter(([_, type]) => type === 'event'),
      map(() => MissionDetailActions.reloadMission()),
    );
  });

  initialUsersLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.openDialog, BatchEnrollmentActions.backToEnrollList),
      map(() => BatchEnrollmentActions.filterUsers({ filter: '' })),
    );
  });

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.openDialog, BatchEnrollmentActions.filterUsers),
      concatLatestFrom(() => [this.store.select(batchEnrollmentFeature.selectFilter)]),
      switchMap(([_, { search, page }]) => {
        return this._batchEnrollmentService.filterUsers(search, page).pipe(
          map(({ data, meta }) =>
            BatchEnrollmentActions.loadUsersSuccess({
              results: data,
              isFinished: meta?.current_page === meta?.total_pages,
              totalItems: meta?.total_items,
              concatResults: false,
            }),
          ),
          catchError(() => of(BatchEnrollmentActions.loadUsersFailure())),
        );
      }),
    );
  });

  loadMoreUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.loadMoreUsers),
      concatLatestFrom(() => [
        this.store.select(batchEnrollmentFeature.selectFilter),
        this.store.select(batchEnrollmentFeature.selectIsFinished),
      ]),
      filter(([_, _filter, isFinished]) => !isFinished),
      switchMap(([_, { search, page }]) => {
        return this._batchEnrollmentService.filterUsers(search, page).pipe(
          map(({ data, meta }) =>
            BatchEnrollmentActions.loadUsersSuccess({
              results: data,
              isFinished: meta?.current_page === meta?.total_pages,
              totalItems: meta?.total_items,
              concatResults: true,
            }),
          ),
          catchError(() => of(BatchEnrollmentActions.loadUsersFailure())),
        );
      }),
    );
  });

  parseUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.parseUsers),
      switchMap(({ file }) =>
        this._batchEnrollmentService.parseUsers(file).pipe(
          map(({ founds, not_founds }) => {
            return BatchEnrollmentActions.parseUsersSuccess({
              users: founds,
              notFounds: not_founds,
            });
          }),
          catchError((error) => of(BatchEnrollmentActions.parseUsersFailure({ error }))),
        ),
      ),
    );
  });

  selectParsedUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.parseUsersSuccess),
      map(({ users }) =>
        BatchEnrollmentActions.addToSelection({ ids: BatchEnrollmentService.mapUserIdsSelection(users) }),
      ),
    );
  });

  toggleSelectAll$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.toggleSelectAll),
      concatLatestFrom(() => this.store.select(batchEnrollmentFeature.selectAll)),
      map(([{ selected }, listItems]) =>
        BatchEnrollmentActions.setSelection({
          selectedIds: selected ? BatchEnrollmentService.mapUserIdsSelection(listItems) : {},
        }),
      ),
    );
  });

  resetState = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentActions.resetState),
      map(() => CyclesActions.reset()),
    );
  });

  constructor(
    private actions$: Actions,
    private _batchEnrollmentService: BatchEnrollmentService,
    private _groupErrorHandlerService: GenericErrorHandlerService,
    private store: Store,
  ) {}
}
