import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, concat, EMPTY, exhaustMap, filter, map, of, switchMap } from 'rxjs';
import { FeedActions, feedFeature } from '..';
import { PulsesListService } from '../../services/pulses-list.service';
import { pulsesListFeature } from './pulses-list.feature';
import * as PulsesListActions from './pulses-list.actions';

@Injectable()
export class PulsesListEffects {
  private readonly actions$ = inject(Actions);
  private readonly pulsesListService = inject(PulsesListService);
  private readonly store = inject(Store);

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.init),
      map(() => PulsesListActions.loadPulsesList()),
    );
  });

  onTabFeed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.setTab),
      filter(({ tab }) => tab === 'feed'),
      map(() => PulsesListActions.loadPulsesList()),
    );
  });

  loadPulsesList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.loadPulsesList),
      concatLatestFrom(() => [
        this.store.select(pulsesListFeature.selectFilter),
        this.store.select(feedFeature.selectActivePulsesListParams),
      ]),
      switchMap(([_, filterParams, activeParams]) =>
        this.pulsesListService.loadPulsesList({ ...filterParams, ...activeParams }).pipe(
          map((payload) => PulsesListActions.loadPulsesListSuccess({ payload })),
          catchError(() => of(PulsesListActions.loadPulsesListFailure())),
        ),
      ),
    );
  });

  fetchMorePulses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.fetchMorePulses),
      concatLatestFrom(() => [
        this.store.select(pulsesListFeature.selectFinished),
        this.store.select(pulsesListFeature.selectFilter),
        this.store.select(feedFeature.selectActivePulsesListParams),
      ]),
      filter(([_, isFinished]) => !isFinished),
      map(([_, __, filterParams, activeParams]) => ({ ...filterParams, ...activeParams })),
      exhaustMap((filterParams) => {
        return this.pulsesListService.loadPulsesList(filterParams).pipe(
          map((response) =>
            PulsesListActions.fetchMorePulsesSuccess({
              payload: { response, updatedFilter: { cursor: response.next_cursor } },
            }),
          ),
          catchError(() => of(PulsesListActions.fetchMorePulsesFailure())),
        );
      }),
    );
  });

  onSelectChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.selectChannel),
      concatLatestFrom(() => this.store.select(feedFeature.selectSelectedTab)),
      filter(([, tab]) => tab === 'feed'),
      map(() => PulsesListActions.loadPulsesList()),
    );
  });

  onSideFilterChangedReloadPulses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeedActions.setSideFilters, FeedActions.clearSideFilters),
      concatLatestFrom(() => this.store.select(feedFeature.selectSelectedTab)),
      filter(([, tab]) => tab === 'feed'),
      map(() => PulsesListActions.loadPulsesList()),
    );
  });

  loadPulseComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.loadPulseComments),
      switchMap(({ pulseId }) =>
        this.pulsesListService.loadPulseComments(pulseId).pipe(
          map((comments) => PulsesListActions.loadPulseCommentsSuccess({ pulseId, comments })),
          catchError(() => EMPTY),
        ),
      ),
    );
  });

  submitComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.submitComment),
      concatLatestFrom(({ pulseId }) =>
        this.store.select(pulsesListFeature.selectEntities).pipe(map((entities) => entities[pulseId])),
      ),
      switchMap(([{ pulseId, text, displayComment }, pulse]) => {
        const loadIfNeeded$ =
          pulse?.comments == null
            ? this.pulsesListService
                .loadPulseComments(pulseId)
                .pipe(map((comments) => PulsesListActions.loadPulseCommentsSuccess({ pulseId, comments })))
            : EMPTY;

        const save$ = this.pulsesListService.submitComment(pulseId, text).pipe(
          map((res) =>
            PulsesListActions.addComment({
              pulseId,
              comment: {
                ...displayComment,
                id: res.id ?? displayComment.id,
                created_at: res.created_date ?? displayComment.created_at,
              },
            }),
          ),
          catchError(() => of(PulsesListActions.submitCommentFailure({ pulseId }))),
        );

        return concat(loadIfNeeded$, save$);
      }),
    );
  });

  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.deleteComment),
      switchMap(({ pulseId, commentId }) =>
        this.pulsesListService.deleteComment(commentId).pipe(
          map(() => PulsesListActions.deleteCommentSuccess({ pulseId, commentId })),
          catchError(() => of(PulsesListActions.deleteCommentFailure())),
        ),
      ),
    );
  });

  editComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulsesListActions.editComment),
      switchMap(({ pulseId, commentId, text }) =>
        this.pulsesListService.editComment(commentId, pulseId, text).pipe(
          map(() => PulsesListActions.editCommentSuccess({ pulseId, commentId, text })),
          catchError(() => of(PulsesListActions.editCommentFailure())),
        ),
      ),
    );
  });
}
