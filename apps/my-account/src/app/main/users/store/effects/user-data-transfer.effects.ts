import { Injectable } from '@angular/core';
import { UserDataTransferService } from '@app/shared/services/user-data-transfer.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { UserDataTransferActions } from 'app/main/users/store/actions';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { userDataTransferFeature } from '../features';
import { UserDetailsSelector } from '../selectors';

@Injectable()
export class UserDataTransferEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDataTransferActions.init),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUser)),
      switchMap(([_, user]) =>
        this.userDataTransferService
          .openUserDataTransferDialog(user)
          .pipe(map((data) => UserDataTransferActions.transferData({ data }))),
      ),
    );
  });

  transferData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserDataTransferActions.transferData),
        switchMap(({ data }) => this.userDataTransferService.transferData(data)),
      );
    },
    { dispatch: false },
  );

  loadSourceUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDataTransferActions.loadSourceUsers, UserDataTransferActions.init),
      concatLatestFrom(() => this.store.select(userDataTransferFeature.selectSearch)),
      switchMap(([_, search]) => {
        return this.userDataTransferService
          .fetchSourceUsers(search)
          .pipe(map((users) => UserDataTransferActions.loadSourceUsersSuccess({ users })));
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private userDataTransferService: UserDataTransferService,
  ) {}
}
