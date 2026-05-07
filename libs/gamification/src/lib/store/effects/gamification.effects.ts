import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { GamificationService } from '../../services/gamification.service';
import { GamificationActions } from '../actions';

@Injectable()
export class GamificationEffects {
  constructor(
    private _actions$: Actions,
    private _gamificationService: GamificationService,
  ) {}

  loadSubModules$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GamificationActions.loadSubModules),
      switchMap(() =>
        this._gamificationService
          .getSubModules()
          .pipe(map((subModules) => GamificationActions.loadSubModulesSuccess({ subModules }))),
      ),
    );
  });
}
