import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { MissionTransferService } from 'app/main/mission-transfer/services/mission-transfer.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionTransferActions } from '../actions';
import { MissionTransferSelectors } from '../selectors';

@Injectable()
export class MissionTransferEffects {
  constructor(
    private _actions$: Actions,
    private _missionTransferDialogService: MissionTransferService,
    private store: Store,
  ) {}

  openDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionTransferActions.openDialog),
        map(() => this._missionTransferDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  closeDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionTransferActions.closeDialog),
        map(() => {
          this._missionTransferDialogService.closeDialog();
        }),
      );
    },
    { dispatch: false },
  );

  filterRecipients$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTransferActions.filterRecipients),
      concatLatestFrom(() => [
        this.store.select(MissionTransferSelectors.selectTransferType),
        this.store.select(MissionTransferSelectors.selectEdWorkspace),
      ]),
      switchMap(([action, transferType, selectedWorkspace]) => {
        const search = action.search;
        return this._missionTransferDialogService.filterRecipients(search, transferType, selectedWorkspace?.id).pipe(
          map((response) => MissionTransferActions.filterRecipientsSuccess({ response })),
          catchError((error) => of(MissionTransferActions.filterRecipientsFailure({ error }))),
        );
      }),
    );
  });

  positiveButtonClick$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTransferActions.positiveButtonClick),
      concatLatestFrom(() => [
        this.store.select(MissionTransferSelectors.selectCurrentStep),
        this.store.select(MissionTransferSelectors.selectEdRecipient),
        this.store.select(MissionTransferSelectors.selectTransferType),
      ]),
      map(([_, currentStep, selectedRecipient, transferType]) => {
        const hasRecipient = !!selectedRecipient;
        return MissionTransferService.getNextAction(currentStep, hasRecipient, transferType);
      }),
    );
  });

  negativeButtonClick$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTransferActions.negativeButtonClick),
      concatLatestFrom(() => this.store.select(MissionTransferSelectors.selectCurrentStep)),
      map(([_, currentStep]) => MissionTransferService.getPreviousAction(currentStep)),
    );
  });

  loadUserWorkspaces$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTransferActions.loadUserWorkspaces),
      concatLatestFrom(() => this.store.select(MissionTransferSelectors.selectTransferType)),
      switchMap(([_, transferType]) => {
        return this._missionTransferDialogService.loadUserWorkspaces(transferType).pipe(
          map((workspaces) => MissionTransferActions.loadUserWorkspacesSuccess({ workspaces })),
          catchError((error) => of(MissionTransferActions.loadUserWorkspacesFailure({ error }))),
        );
      }),
    );
  });

  executeTransfer$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTransferActions.executeTransfer),
      concatLatestFrom(() => [
        this.store.select(MissionTransferSelectors.selectEdMission),
        this.store.select(MissionTransferSelectors.selectTransferType),
        this.store.select(MissionTransferSelectors.selectEdRecipient),
        this.store.select(MissionTransferSelectors.selectEdWorkspace),
      ]),
      switchMap(([_, selectedMission, transferType, selectedRecipient, selectedWorkspace]) => {
        return this._missionTransferDialogService
          .executeTransfer({
            missionId: selectedMission?.id || '',
            transferType,
            newOwnerId: selectedRecipient?.id,
            targetWorkspaceId: selectedWorkspace?.id,
          })
          .pipe(
            map(() => MissionTransferActions.closeDialog()),
            catchError((error) => of(MissionTransferActions.executeTransferFailure({ error }))),
          );
      }),
    );
  });
}
