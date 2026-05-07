import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import * as FeedActions from './feed.actions';
import { feedFeature } from './feed.feature';
import { FeedService } from '../../services/feed.service';

@Injectable()
export class FeedEffects {
  private readonly actions$ = inject(Actions);
  private readonly feedService = inject(FeedService);
  private readonly store = inject(Store);

  loadFavoritePulses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.init),
      switchMap(() =>
        this.feedService.loadFavoritePulses().pipe(
          map((favoritePulses) => FeedActions.loadFavoritePulsesSuccess({ favoritePulses })),
          catchError(() => of(FeedActions.loadFavoritePulsesFailure())),
        ),
      ),
    );
  });

  loadChannelsFilterCreatedByMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.init, FeedActions.reloadChannelsFilterCreatedByMe),
      concatLatestFrom(() => this.store.select(feedFeature.selectIsCurator)),
      filter(([, isCurator]) => isCurator),
      switchMap(() =>
        this.feedService.loadChannelsFilterCreatedByMe().pipe(
          map((items) => FeedActions.loadChannelsFilterCreatedByMeSuccess({ items })),
          catchError(() => of(FeedActions.loadChannelsFilterCreatedByMeFailure())),
        ),
      ),
    );
  });

  loadChannelsFilterSubscribed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.init),
      switchMap(() =>
        this.feedService.loadChannelsFilterSubscribed().pipe(
          map((items) => FeedActions.loadChannelsFilterSubscribedSuccess({ items })),
          catchError(() => of(FeedActions.loadChannelsFilterSubscribedFailure())),
        ),
      ),
    );
  });

  loadPulseTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.init, FeedActions.loadPulseTypes),
      switchMap(() =>
        this.feedService.loadPulseTypes().pipe(
          map((pulseTypes) => FeedActions.loadPulseTypesSuccess({ pulseTypes })),
          catchError(() => of(FeedActions.loadPulseTypesFailure())),
        ),
      ),
    );
  });
}
