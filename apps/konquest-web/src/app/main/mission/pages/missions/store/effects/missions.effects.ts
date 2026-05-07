import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { UserProfileSelectors } from 'app/shared/store/selectors';
import { mapCoursesToLearnContentCard, mapMissionToLearnContentCard } from 'app/shared/utils/card-helpers';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CourseListService } from '../../services/course-list.service';
import { MissionsActions } from '../actions';
import { missionsFeature } from '../features';

@Injectable()
export class MissionsEffects {
  constructor(
    private _actions$: Actions,
    private _courseListService: CourseListService,
    private store: Store,
  ) {}

  loadMissions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionsActions.init, MissionsActions.loadMissions),
      concatLatestFrom(() => [
        this.store.select(missionsFeature.selectFilter),
        this.store.select(missionsFeature.selectScreenType),
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
        this.store.select(UserProfileSelectors.selectIsAdmin),
      ]),
      switchMap(([_, filter, screenType, isSuperAdmin, isAdmin]) =>
        this._courseListService.fetchMissions(filter, screenType).pipe(
          map(({ missions, finished }) => {
            const mappedCourses = mapCoursesToLearnContentCard(missions, isSuperAdmin, isAdmin);
            return MissionsActions.loadMissionsSuccess({ missions: mappedCourses, finished });
          }),
        ),
      ),
    );
  });

  loadRecommendations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionsActions.init),
      filter(({ screenType }) => screenType === 'missions'),
      concatLatestFrom(() => [
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
        this.store.select(UserProfileSelectors.selectIsAdmin),
      ]),
      switchMap(([_, isSuperAdmin, isAdmin]) =>
        this._courseListService.fetchRecommendations().pipe(
          map((missionRecommendations) => {
            const recommendations = mapMissionToLearnContentCard(missionRecommendations, true, isSuperAdmin, isAdmin);
            return MissionsActions.loadRecommendationsSuccess({ recommendations });
          }),
          catchError(() => of(MissionsActions.loadRecommendationsFailure())),
        ),
      ),
    );
  });

  loadMissionProviders$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionsActions.init),
      filter(({ screenType }) => screenType === 'missions'),
      switchMap(() =>
        this._courseListService
          .fetchMissionProviders()
          .pipe(map((providers) => MissionsActions.loadMissionProvidersSuccess({ providers }))),
      ),
    );
  });

  filter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionsActions.filter, MissionsActions.cleanFilter),
      map(() => MissionsActions.loadMissions()),
    );
  });

  loadMoreMissions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionsActions.loadMoreMissions),
      concatLatestFrom(() => [
        this.store.select(missionsFeature.selectFilter),
        this.store.select(missionsFeature.selectScreenType),
        this.store.select(missionsFeature.selectFinished),
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
        this.store.select(UserProfileSelectors.selectIsAdmin),
      ]),
      filter(([_, _filter, _screenType, finished]) => !finished),
      switchMap(([_, filter, screenType, _finished, isSuperAdmin, isAdmin]) =>
        this._courseListService.fetchMissions(filter, screenType).pipe(
          map(({ missions, finished }) => {
            const mappedCourses = mapCoursesToLearnContentCard(missions, isSuperAdmin, isAdmin);
            return MissionsActions.loadMoreMissionsSuccess({ missions: mappedCourses, finished });
          }),
        ),
      ),
    );
  });
}
