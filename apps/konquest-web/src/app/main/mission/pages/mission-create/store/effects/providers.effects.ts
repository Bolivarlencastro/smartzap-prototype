import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionCreateService } from '../../services/mission-create.service';
import { MissionProvidersActions } from '../actions';

@Injectable()
export class ProvidersEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _missionCreateService: MissionCreateService,
  ) {}

  loadTypes$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionProvidersActions.filterProviders),
      switchMap(({ filter }) => {
        return this._missionCreateService.getProviders(filter).pipe(
          map(({ results }) => MissionProvidersActions.filterProvidersSuccess({ providers: results })),
          catchError((error) => of(MissionProvidersActions.filterProvidersFailure({ error }))),
        );
      }),
    );
  });
}
