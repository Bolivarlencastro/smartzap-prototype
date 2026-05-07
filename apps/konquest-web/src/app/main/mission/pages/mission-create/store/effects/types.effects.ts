import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionCreateService } from '../../services/mission-create.service';
import { MissionTypesActions } from '../actions';
import { TypesSelectors } from '../selectors';

@Injectable()
export class TypesEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _missionCreateService: MissionCreateService,
  ) {}

  loadTypes$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionTypesActions.loadTypes),
      concatLatestFrom(() => this.store.select(TypesSelectors.selectTypesLoaded)),
      switchMap(([_, loaded]) => {
        if (loaded) {
          return of(MissionTypesActions.skipTypesLoad());
        }
        return this._missionCreateService.getTypes().pipe(
          map(({ results }) => MissionTypesActions.loadTypesSuccess({ types: results })),
          catchError((error) => of(MissionTypesActions.loadTypesFailure({ error }))),
        );
      }),
    );
  });
}
