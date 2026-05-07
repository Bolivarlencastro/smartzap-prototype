import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ListService } from '../../../services/list.service';
import { PulseListActions } from '../actions';
import { pulseListFeature } from '../features';

@Injectable()
export class PulseListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(PulseListActions.init),
      concatLatestFrom(() => this.store.select(pulseListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => PulseListActions.fetchPulses()),
    );
  });

  fetchPulses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(PulseListActions.fetchPulses),
      concatLatestFrom(() => this.store.select(pulseListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.listService.getPulses(filter).pipe(
          map((response) => PulseListActions.fetchPulsesSuccess({ response })),
          catchError(() => of(PulseListActions.fetchPulsesFailure())),
        ),
      ),
    );
  });

  reloadPulses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(PulseListActions.search, PulseListActions.sort, PulseListActions.setPagination),
      map(() => PulseListActions.fetchPulses()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly listService: ListService,
    private readonly store: Store,
  ) {}
}
