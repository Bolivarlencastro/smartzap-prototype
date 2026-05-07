import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GroupUserAPI } from '../group-user.api';
import * as GroupUserActions from './group-user.actions';
import * as GroupUserSelector from './group-user.selectors';

@Injectable()
export class GroupUserEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.init),
      map(() => GroupUserActions.loadGroupUsers()),
    );
  });

  loadGroupUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.loadGroupUsers),
      concatLatestFrom(() => [
        this.store.select(GroupUserSelector.selectGroupId),
        this.store.select(GroupUserSelector.selectQueryParams),
      ]),
      switchMap(([_, groupId, queryParams]) =>
        this.service.fetchByQuery(groupId, queryParams).pipe(
          map((data) => GroupUserActions.loadGroupUsersSuccess({ data })),
          catchError((error) => of(GroupUserActions.loadGroupUsersFailure({ error }))),
        ),
      ),
    );
  });

  addGroupUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.addGroupUsers),
      concatLatestFrom(() => this.store.select(GroupUserSelector.selectGroupId)),
      switchMap(([payload, groupId]) =>
        this.service.addMany({ ...payload, groupId }).pipe(
          tap((data) => {
            this._errorHandlerService.showImportEnrollmentsErrorDialog(data);

            if (data.group_user_warnings?.length) {
              this._messageService.info(data.group_user_warnings[0].warning_detail?.detail);
            }

            if (data.group_user_errors.length === 0) {
              this._messageService.success(marker('GROUP.SUCCESS.LINKED_USER'));
            }
          }),
          map(() => GroupUserActions.loadGroupUsers()),
          catchError((error) => of(GroupUserActions.loadGroupUsersFailure({ error }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.deleteGroupUser),
      concatLatestFrom(() => this.store.select(GroupUserSelector.selectGroupId)),
      switchMap(([{ id, userId, removeEnrollments }, groupId]) =>
        this.service.delete(groupId, userId, removeEnrollments).pipe(
          map(() => GroupUserActions.deleteGroupUserSuccess({ id })),
          catchError((error) => of(GroupUserActions.loadGroupUsersFailure({ error }))),
        ),
      ),
    );
  });

  changeParams$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.filter, GroupUserActions.order, GroupUserActions.filterByDeletedUsers),
      map(() => GroupUserActions.loadGroupUsers()),
    );
  });

  setPagination$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupUserActions.setPagination),
      map(() => GroupUserActions.loadGroupUsers()),
    );
  });

  constructor(
    private actions$: Actions,
    private service: GroupUserAPI,
    private _errorHandlerService: GenericErrorHandlerService,
    private _messageService: KpMessageService,
    private store: Store,
  ) {}
}
