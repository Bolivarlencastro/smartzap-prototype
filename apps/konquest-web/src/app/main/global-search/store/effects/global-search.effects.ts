import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MissionServiceV2 } from '@app/main/mission/services/mission.service';
import { categoriesFeature } from '@app/shared/store';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { navigateToEvent, navigateToMission, navigateToTrail } from 'app/shared/services';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { GlobalSearchService } from '../../services/global-search.service';
import { GlobalSearchActions } from '../actions';
import { GlobalSearchSelectors } from '../selectors';

@Injectable()
export class GlobalSearchEffects {
  constructor(
    private _actions$: Actions,
    private _globalSearchService: GlobalSearchService,
    private _router: Router,
    private _missionService: MissionServiceV2,
    private _learningTrailAPI: LearningTrailAPI,
    private store: Store,
  ) {}

  openDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openDialog),
      concatLatestFrom(() => this.store.select(categoriesFeature.selectMissionsFiltered)),
      switchMap(([_, categories]) => {
        return this._missionService.fetchProviders().pipe(
          map(({ results }) => {
            const filterOptions = this._globalSearchService.getFilterOptions(categories, results);
            return GlobalSearchActions.updateFilter({ filter: {}, filterOptions });
          }),
        );
      }),
    );
  });

  getTabs$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openDialog),
      map(() => {
        const tabs = this._globalSearchService.getTabs();
        return GlobalSearchActions.getTabs({ tabs });
      }),
    );
  });

  updateFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.updateFilter),
      map(() => GlobalSearchActions.loadItems()),
    );
  });

  cleanFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.cleanFilter),
      map(() => GlobalSearchActions.loadItems()),
    );
  });

  loadItems$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.loadItems),
      concatLatestFrom(() => this.store.select(GlobalSearchSelectors.selectFilter)),
      switchMap(([_, storeFilter]) => {
        const { contentType, ...filter } = storeFilter;
        return this._globalSearchService.getItems(contentType, filter).pipe(
          map((response) => GlobalSearchActions.loadItemsSuccess({ response })),
          catchError((error) => of(GlobalSearchActions.loadItemsFailure({ error }))),
        );
      }),
    );
  });

  fetchMoreItems$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.fetchMoreItems),
      concatLatestFrom(() => [
        this.store.select(GlobalSearchSelectors.selectFilter),
        this.store.select(GlobalSearchSelectors.selectIsFinished),
      ]),
      filter(([_, _storeFilter, isFinished]) => !isFinished),
      map(([_, storeFilter, _isFinished]) => storeFilter),
      switchMap((storeFilter) => {
        const { contentType, ...filter } = storeFilter;
        return this._globalSearchService.getItems(contentType, filter).pipe(
          map((response) => GlobalSearchActions.fetchMoreItemsSuccess({ response })),
          catchError((error) => of(GlobalSearchActions.fetchMoreItemsFailure({ error }))),
        );
      }),
    );
  });

  closeDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(GlobalSearchActions.closeDialog),
        tap(() => this._globalSearchService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  openMissionDetails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openMissionDetails),
      map(({ id }) => {
        navigateToMission(this._router, id);
        return GlobalSearchActions.closeDialog();
      }),
    );
  });

  openEventDetails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openEventDetails),
      map(({ id }) => {
        navigateToEvent(this._router, id);
        return GlobalSearchActions.closeDialog();
      }),
    );
  });

  openTrailDetails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openTrailDetails),
      map(({ id }) => {
        navigateToTrail(this._router, id);
        return GlobalSearchActions.closeDialog();
      }),
    );
  });

  openChannelDetails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openChannelDetails),
      map(({ id }) => {
        this._router.navigate(['/channels', 'details', id]);
        return GlobalSearchActions.closeDialog();
      }),
    );
  });

  openPulseDetails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openPulseDetails),
      map(({ id, pulse_type }) => {
        this._globalSearchService.openPulseDetails(id, pulse_type);
        return GlobalSearchActions.closeDialog();
      }),
    );
  });

  openContentOnTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openContentOnTrail),
      switchMap(({ id }) =>
        this._learningTrailAPI.getById(id).pipe(
          map((trail) => {
            const item = this._globalSearchService.findLastContentItem(trail);
            if (item) {
              return GlobalSearchActions.openContent({ item });
            }
            return GlobalSearchActions.openTrailDetails({ id });
          }),
        ),
      ),
    );
  });

  openContent$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(GlobalSearchActions.openContent),
        tap(({ item }) => this._globalSearchService.navigateToContent(item)),
      );
    },
    { dispatch: false },
  );

  closeDialogOnOpenContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(GlobalSearchActions.openContent),
      filter(({ item }) => !!item && !item.external_url),
      map(() => GlobalSearchActions.closeDialog()),
    );
  });
}
