import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ToolsHubActions, toolsHubFeature } from '.';
import { ToolsHubService } from '../services/tools-hub.service';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class ToolsHubEffects {
  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly toolsHubService: ToolsHubService,
    private readonly messageService: KpMessageService,
  ) {}

  loadData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.loadData),
      switchMap(() =>
        this.toolsHubService.getData().pipe(
          map((items) => ToolsHubActions.loadDataSuccess({ items })),
          catchError(() => of(ToolsHubActions.loadDataFailure())),
        ),
      ),
    );
  });

  setToolsGlobalSettings$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.loadDataSuccess),
      concatLatestFrom(() => this.store.select(toolsHubFeature.selectItems)),
      map(([_, customMenuItems]) => GlobalSettingsActions.setCustomMenuItems({ customMenuItems })),
    );
  });

  reload$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.createSuccess, ToolsHubActions.editSuccess, ToolsHubActions.removeSuccess),
      map(() => ToolsHubActions.loadData()),
    );
  });

  openConfigDialog$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.openConfigDialog),
      switchMap(({ item }) =>
        this.toolsHubService
          .openConfigDialog(item)
          .pipe(map((data) => (data.id ? ToolsHubActions.edit({ data }) : ToolsHubActions.create({ data })))),
      ),
    );
  });

  create$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.create),
      switchMap(({ data }) =>
        this.toolsHubService.create(data).pipe(
          map(() => ToolsHubActions.createSuccess({ message: 'TOOLS_HUB.MESSAGES.CREATE_SUCCESS' })),
          catchError(() => of(ToolsHubActions.createFailure({ message: 'TOOLS_HUB.MESSAGES.CREATE_FAILURE' }))),
        ),
      ),
    );
  });

  edit$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.edit),
      switchMap(({ data }) =>
        this.toolsHubService.edit(data).pipe(
          map(() => ToolsHubActions.editSuccess({ message: 'TOOLS_HUB.MESSAGES.EDIT_SUCCESS' })),
          catchError(() => of(ToolsHubActions.editFailure({ message: 'TOOLS_HUB.MESSAGES.EDIT_FAILURE' }))),
        ),
      ),
    );
  });

  remove$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ToolsHubActions.remove),
      switchMap(({ id }) =>
        this.toolsHubService.remove(id).pipe(
          map(() => ToolsHubActions.removeSuccess({ message: 'TOOLS_HUB.MESSAGES.REMOVE_SUCCESS' })),
          catchError(() => of(ToolsHubActions.removeFailure({ message: 'TOOLS_HUB.MESSAGES.REMOVE_FAILURE' }))),
        ),
      ),
    );
  });

  successMessage$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ToolsHubActions.createSuccess, ToolsHubActions.editSuccess, ToolsHubActions.removeSuccess),
        tap(({ message }) => this.messageService.success(message)),
      );
    },
    { dispatch: false },
  );

  failureMessage$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ToolsHubActions.createFailure, ToolsHubActions.editFailure, ToolsHubActions.removeFailure),
        tap(({ message }) => this.messageService.error(message)),
      );
    },
    { dispatch: false },
  );
}
