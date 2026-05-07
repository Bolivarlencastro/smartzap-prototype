import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs';
import { BatchActionsService } from '../../services/batch-actions.service';
import * as MissionEnrollmentsActions from '../mission-enrollments.actions';
import * as MissionEnrollmentsSelectors from '../mission-enrollments.selectors';
import * as BatchActionsActions from './batch-actions.actions';
import { batchActionsFeature } from './batch-actions.feature';

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
        this.store.select(MissionEnrollmentsSelectors.selectFilter),
        this.store.select(MissionEnrollmentsSelectors.selectHasAppliedFilter),
      ]),
      switchMap(([{ action, enrollmentIds, total }, isTotalSelected, filter, hasAppliedFilter]) => {
        const enrollmentFilter = hasAppliedFilter ? filter : null;
        const count = isTotalSelected ? total : enrollmentIds.length;
        const ids = isTotalSelected ? [] : enrollmentIds;
        return this.batchActionsService.dispatchAction(action, ids, enrollmentFilter, count).pipe(
          tap(() => this.messageService.info('BATCH_ACTION.MESSAGE')),
          map(() => MissionEnrollmentsActions.loadEnrollments()),
        );
      }),
    );
  });
}
