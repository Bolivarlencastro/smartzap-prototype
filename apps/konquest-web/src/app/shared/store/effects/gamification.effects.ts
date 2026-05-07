import { Injectable } from '@angular/core';
import { GamificationService } from '@app/shared/services/gamification.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, map, mergeMap, of, switchMap } from 'rxjs';
import { GamificationActions } from '../actions';

@Injectable()
export class GamificationEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.init),
      mergeMap(() => concat(of(GamificationActions.loadGamification()), of(GamificationActions.loadPersonalScore()))),
    );
  });

  loadGamification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.loadGamification),
      switchMap(() =>
        this.gamificationService.fetchGamification().pipe(
          map((data) => {
            if (data) {
              return GamificationActions.loadGamificationSuccess({ data });
            }
            return GamificationActions.loadGamificationSubModules();
          }),
        ),
      ),
    );
  });

  loadGamificationSubModules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.loadGamificationSubModules),
      switchMap(() =>
        this.gamificationService
          .fetchGamificationSubModules()
          .pipe(map((data) => GamificationActions.loadGamificationSuccess({ data }))),
      ),
    );
  });

  updateGamificationSubModules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.updateGamificationSubModules),
      switchMap(({ item, value }) =>
        this.gamificationService
          .updateGamificationSubModules(item, value)
          .pipe(map((data) => GamificationActions.updateGamificationSubModulesSuccess({ data }))),
      ),
    );
  });

  loadGamificationMenu$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.loadGamificationMenu),
      switchMap(() =>
        this.gamificationService
          .fetchGamificationMenu()
          .pipe(map((data) => GamificationActions.loadGamificationMenuSuccess({ data }))),
      ),
    );
  });

  loadPersonalScore$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GamificationActions.loadPersonalScore),
      switchMap(() =>
        this.gamificationService
          .fetchPersonalScore()
          .pipe(map((personalScore) => GamificationActions.loadPersonalScoreSuccess({ personalScore }))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private gamificationService: GamificationService,
  ) {}
}
