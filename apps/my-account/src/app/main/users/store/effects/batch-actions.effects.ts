import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs';
import { BatchActionsService } from '../../services/batch-actions.service';
import { BatchActionsActions, UsersListActions } from '../actions';
import { batchActionsFeature } from '../features';
import { UsersListSelectors } from '../selectors';

@Injectable()
export class BatchActionsEffects {
  constructor(
    private actions: Actions,
    private store: Store,
    private batchActionsService: BatchActionsService,
    private messageService: KpMessageService,
  ) {}

  dispatchAction$ = createEffect(() => {
    return this.actions.pipe(
      ofType(BatchActionsActions.dispatchAction),
      concatLatestFrom(() => [
        this.store.select(batchActionsFeature.selectIsTotalSelected),
        this.store.select(UsersListSelectors.selectFilters),
        this.store.select(UsersListSelectors.selectHasAppliedFilter),
      ]),
      switchMap(([{ action, ids, total }, isTotalSelected, filter, hasAppliedFilter]) => {
        const usersFilter = hasAppliedFilter ? filter : null;
        const count = isTotalSelected ? total : ids.length;
        const userIds = isTotalSelected ? [] : ids;
        return this.batchActionsService.dispatchAction(action, userIds, usersFilter, count).pipe(
          tap(() => this.messageService.info('BATCH_ACTION.MESSAGE')),
          map(() => UsersListActions.loadUsers()),
        );
      }),
    );
  });
}
