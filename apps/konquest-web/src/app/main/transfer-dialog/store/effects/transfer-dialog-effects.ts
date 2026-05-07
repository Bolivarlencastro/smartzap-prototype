import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { concat, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Recipient, TransferDialogData } from '../../models';
import { TransferDialogService } from '../../services/transfer-dialog.service';
import { TransferDialogActions } from '../actions';
import { TransferDialogSelectors } from '../selectors';

@Injectable()
export class TransferDialogEffects {
  constructor(
    private _actions$: Actions,
    private _transferDialogService: TransferDialogService,
    private store: Store,
  ) {}

  openDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(TransferDialogActions.openDialog),
        map(({ dialogData }) => {
          this._transferDialogService.openDialog(dialogData);
        }),
      );
    },
    { dispatch: false },
  );

  filterRecipients$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferDialogActions.filterRecipients),
      switchMap(({ searchTerm }) => {
        return this._transferDialogService.filterRecipients(searchTerm).pipe(
          map((response) => TransferDialogActions.filterRecipientsSuccess({ response })),
          catchError((error) => of(TransferDialogActions.filterRecipientsFailure({ error }))),
        );
      }),
    );
  });

  positiveButtonClick$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferDialogActions.positiveButtonClick),
      concatLatestFrom(() => [
        this.store.select(TransferDialogSelectors.selectCurrentStep),
        this.store.select(TransferDialogSelectors.selectEdRecipient),
      ]),
      map(([_, currentStep, selectedRecipient]) => {
        const hasRecipient = !!selectedRecipient;
        return TransferDialogService.getNextAction(currentStep, hasRecipient);
      }),
    );
  });

  negativeButtonClick$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferDialogActions.negativeButtonClick),
      concatLatestFrom(() => this.store.select(TransferDialogSelectors.selectCurrentStep)),
      map(([_, currentStep]) => TransferDialogService.getPreviousAction(currentStep)),
    );
  });

  executeTransfer$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TransferDialogActions.executeTransfer),
      concatLatestFrom(() => [
        this.store.select(TransferDialogSelectors.selectTransferData),
        this.store.select(TransferDialogSelectors.selectEdRecipient),
      ]),
      switchMap(([_, transferData, selectedRecipient]) => {
        return this._transferDialogService
          .executeTransfer(transferData ?? ({} as TransferDialogData), selectedRecipient ?? ({} as Recipient))
          .pipe(
            switchMap(() =>
              concat(
                of(TransferDialogActions.closeDialog()),
                of(
                  TransferDialogActions.executeTransferSuccess({ currentUser: transferData?.transferContent.id || '' }),
                ),
              ),
            ),
            catchError((error) => of(TransferDialogActions.executeTransferFailure({ error }))),
          );
      }),
    );
  });

  closeDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(TransferDialogActions.closeDialog),
        map(() => {
          this._transferDialogService.closeDialog();
        }),
      );
    },
    { dispatch: false },
  );
}
