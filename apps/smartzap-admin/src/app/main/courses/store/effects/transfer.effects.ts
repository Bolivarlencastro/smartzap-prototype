import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from 'app/main/users/services';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { CoursesService } from '../../services';
import { CourseActions, TransferActions } from '../actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class TransferEffects {
  loadUsersByRoleId$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferActions.loadUsersByRoleId),
      concatMap((action) =>
        this._usersService.fetchUsersByRoleId(action.roleId).pipe(
          map((users) => TransferActions.loadUsersByRoleIdSuccess({ users })),
          catchError((error) => of(TransferActions.loadUsersByRoleIdFailure({ error }))),
        ),
      ),
    );
  });

  transferOwnership$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferActions.transferOwnership),
      concatMap((action) =>
        this._couserService.transferOwnership(action.courseId, action.userId).pipe(
          map((transfer) => {
            this._messageService.success(marker('TRANSFER.SUCCESS'));
            const courseId = action.courseId;
            return TransferActions.transferOwnershipSuccess({ transfer, courseId });
          }),
          catchError((error) => {
            this._messageService.error(marker('TRANSFER.ERROR'));
            return of(TransferActions.transferOwnershipFailure({ error }));
          }),
        ),
      ),
    );
  });

  transferOwnerShipSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferActions.transferOwnershipSuccess),
      map(({ courseId }) => CourseActions.loadCourse({ id: courseId })),
    );
  });

  constructor(
    private _actions$: Actions,
    private _usersService: UsersService,
    private readonly _messageService: KpMessageService,
    private _couserService: CoursesService,
  ) {}
}
