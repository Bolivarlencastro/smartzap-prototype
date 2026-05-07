import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromMissionInfo from '../actions/missions-info.actions';
import * as fromMissionTypes from '../actions/types.actions';

@Injectable()
export class MissionInfoEffects {
  init$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromMissionInfo.init),
      map(() => fromMissionTypes.loadTypes()),
    );
  });

  constructor(private _actions$: Actions) {}
}
