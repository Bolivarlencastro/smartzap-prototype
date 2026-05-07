import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, of, switchMap } from 'rxjs';
import { GamificationService } from '../../services/gamification.service';
import { GamificationListActions } from '../actions';
import { gamificationListFeature } from '../features';

@Injectable()
export class GamificationListEffects {
  constructor(
    private _actions$: Actions,
    private _gamificationService: GamificationService,
    private store: Store,
  ) {}

  init$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GamificationListActions.init),
      switchMap(({ path, isMobile }) => {
        if (path === 'points-statement') {
          return this._gamificationService
            .getPersonalScore()
            .pipe(map((personalScore) => GamificationListActions.setInitialSetting({ path, isMobile, personalScore })));
        }
        return of(GamificationListActions.setInitialSetting({ path, isMobile }));
      }),
    );
  });

  reload$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        GamificationListActions.setInitialSetting,
        GamificationListActions.filterByTerm,
        GamificationListActions.setPagination,
        GamificationListActions.filterByDateRange,
        GamificationListActions.cleanFilter,
        GamificationListActions.cleanDateRangeFilter,
      ),
      map(() => GamificationListActions.loadData()),
    );
  });

  loadData$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GamificationListActions.loadData),
      concatLatestFrom(() => [
        this.store.select(gamificationListFeature.selectPath),
        this.store.select(gamificationListFeature.selectFilter),
        this.store.select(gamificationListFeature.selectIsMobile),
      ]),
      switchMap(([_, path, filter, isMobile]) =>
        this._gamificationService
          .getData(path, filter, isMobile)
          .pipe(map((response) => GamificationListActions.loadDataSuccess({ response }))),
      ),
    );
  });
}
