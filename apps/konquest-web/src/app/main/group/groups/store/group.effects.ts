import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { concat, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GroupAPI } from '../group.api';
import * as fromSelectors from '../store/group.selectors';
import * as fromActions from './group.actions';

@Injectable()
export class GroupTestEffects {
  loadGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loadGroups),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectPage),
        this.store.select(fromSelectors.selectPerPage),
        this.store.select(fromSelectors.selectSearch),
      ]),
      switchMap(([_, page, per_page, search]) =>
        this.service.fetchByQuery({ page, per_page, search }).pipe(
          map((pagination) => fromActions.loadGroupsSuccess({ pagination })),
          catchError((error) => of(fromActions.loadGroupsFailure({ error }))),
        ),
      ),
    );
  });

  updateGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateGroup),
      switchMap(({ id, data }) =>
        this.service.update(id, data).pipe(
          switchMap(() => {
            return concat(of(fromActions.updateGroupSuccess()), of(fromActions.updateFilter({ search: '' })));
          }),
          catchError((error) => of(fromActions.updateGroupFailure({ error }))),
        ),
      ),
    );
  });

  deleteGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.deleteGroup),
      switchMap(({ id }) =>
        this.service.deleteOne(id).pipe(
          map(() => fromActions.deleteGroupSuccess({ id })),
          catchError((error) => of(fromActions.deleteGroupFailure({ error }))),
        ),
      ),
    );
  });

  importGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.importGroup),
      switchMap(({ data, objectType: type, goal_date }) => {
        return this.service.import(data, type, goal_date).pipe(
          tap((response) => this._errorHandlerService.showImportEnrollmentsErrorDialog(response)),
          tap((response) => {
            const errors = response.group_user_import_errors;
            if (errors.length === 0) {
              this._messageService.success(marker('GROUP.SUCCESS.IMPORT'));
            }
          }),
          switchMap((response) => {
            return concat(
              of(fromActions.importGroupSuccess({ data: response })),
              of(fromActions.updateFilter({ search: '' })),
            );
          }),
          catchError(() =>
            of(
              fromActions.importGroupFailure({
                error: 'ENROLLMENTS.MESSAGE.IMPORT_ERROR',
              }),
            ),
          ),
        );
      }),
    );
  });

  setPagination$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.setPagination),
      map(() => fromActions.loadGroups()),
    );
  });

  updateFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateFilter),
      map(() => fromActions.loadGroups()),
    );
  });

  constructor(
    private actions$: Actions,
    private service: GroupAPI,
    private _errorHandlerService: GenericErrorHandlerService,
    private _messageService: KpMessageService,
    private store: Store,
  ) {}
}
