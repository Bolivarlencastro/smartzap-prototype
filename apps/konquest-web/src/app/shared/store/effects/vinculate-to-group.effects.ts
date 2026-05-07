import { Injectable } from '@angular/core';
import { GenericErrorHandlerService } from '@app/shared/components/generic-error-handler';
import { VinculateToGroupService } from '@app/shared/services/vinculate-to-group.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';
import { VinculateToGroupActions } from '../actions';
import { vinculateToGroupFeature } from '../features';

@Injectable()
export class VinculateToGroupEffects {
  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VinculateToGroupActions.openDialog),
      switchMap(() =>
        this.vinculateService.openDialog().pipe(
          map((groupId) => {
            if (groupId) {
              return VinculateToGroupActions.vinculate({ groupId });
            }
            return VinculateToGroupActions.resetState();
          }),
        ),
      ),
    );
  });

  loadGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VinculateToGroupActions.loadGroups),
      concatLatestFrom(() => this.store.select(vinculateToGroupFeature.selectSearch)),
      switchMap(([_, search]) =>
        this.vinculateService
          .fetchGroups(search)
          .pipe(map((groups) => VinculateToGroupActions.loadGroupsSuccess({ groups }))),
      ),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VinculateToGroupActions.search),
      map(() => VinculateToGroupActions.loadGroups()),
    );
  });

  vinculate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(VinculateToGroupActions.vinculate),
      concatLatestFrom(() => [
        this.store.select(vinculateToGroupFeature.selectVinculateType),
        this.store.select(vinculateToGroupFeature.selectContentId),
      ]),
      switchMap(([{ groupId }, type, contentId]) =>
        this.vinculateService.vinculateGroup(groupId, type, contentId).pipe(
          tap((data) => this.errorHandlerService.showImportEnrollmentsErrorDialog(data)),
          map(() => VinculateToGroupActions.resetState()),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private vinculateService: VinculateToGroupService,
    private errorHandlerService: GenericErrorHandlerService,
  ) {}
}
