import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, filter, map, of, switchMap, tap } from 'rxjs';
import { PulseDetailsService } from '../../services/pulse-details.service';
import { PulsesListService } from '../../services/pulses-list.service';
import * as PulseDetailsActions from './pulse-details.actions';
import { pulseDetailsFeature } from './pulse-details.feature';
import * as PulsesListActions from '../pulses-list/pulses-list.actions';

@Injectable()
export class PulseDetailsEffects {
  private readonly actions$ = inject(Actions);
  private readonly pulseDetailsService = inject(PulseDetailsService);
  private readonly pulsesListService = inject(PulsesListService);
  private readonly store = inject(Store);

  loadPulseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.loadPulseDetails),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      switchMap(([, pulseId]) =>
        this.pulseDetailsService.loadPulseDetails(pulseId).pipe(
          map((data) => PulseDetailsActions.loadPulseDetailsSuccess({ data })),
          catchError(() => of(PulseDetailsActions.loadPulseDetailsFailure())),
        ),
      ),
    );
  });

  openPulseDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.openPulseDetails),
      tap(() => this.pulseDetailsService.openDialog()),
      map(() => PulseDetailsActions.loadPulseDetails()),
    );
  });

  dialogDestroyed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.dialogDestroy),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectRollbackTrailId)),
      tap(([, rollbackTrailId]) => this.pulseDetailsService.onDialogDestroyed(rollbackTrailId)),
      map(() => PulseDetailsActions.reset()),
    );
  });

  submitComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.submitComment),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      switchMap(([{ text, displayComment }, pulseId]) => {
        if (!pulseId) return EMPTY;
        return this.pulsesListService.submitComment(pulseId, text).pipe(
          map((res) =>
            PulseDetailsActions.submitCommentSuccess({
              comment: {
                ...displayComment,
                id: res.id ?? displayComment.id,
                created_date: res.created_date ?? displayComment.created_date,
              },
            }),
          ),
          catchError(() => of(PulseDetailsActions.submitCommentFailure())),
        );
      }),
    );
  });

  syncPulsesListOnCommentSubmit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.submitCommentSuccess),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      filter(([, pulseId]) => !!pulseId),
      map(([{ comment }, pulseId]) =>
        PulsesListActions.addComment({
          pulseId: pulseId,
          comment: {
            id: comment.id,
            avatar: comment.user.avatar,
            name: comment.user.name,
            user_id: comment.user.id,
            comment: comment.comment,
            created_at: comment.created_date,
          },
        }),
      ),
    );
  });

  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.deleteComment),
      switchMap(({ commentId }) =>
        this.pulsesListService.deleteComment(commentId).pipe(
          map(() => PulseDetailsActions.deleteCommentSuccess({ commentId })),
          catchError(() => of(PulseDetailsActions.deleteCommentFailure())),
        ),
      ),
    );
  });

  syncPulsesListOnCommentDelete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.deleteCommentSuccess),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      filter(([, pulseId]) => !!pulseId),
      map(([{ commentId }, pulseId]) => PulsesListActions.deleteCommentSuccess({ pulseId: pulseId, commentId })),
    );
  });

  editComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.editComment),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      switchMap(([{ commentId, text }, pulseId]) => {
        if (!pulseId) return EMPTY;
        return this.pulsesListService.editComment(commentId, pulseId, text).pipe(
          map(() => PulseDetailsActions.editCommentSuccess({ commentId, text })),
          catchError(() => of(PulseDetailsActions.editCommentFailure())),
        );
      }),
    );
  });

  syncPulsesListOnCommentEdit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.editCommentSuccess),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulseId)),
      filter(([, pulseId]) => !!pulseId),
      map(([{ commentId, text }, pulseId]) =>
        PulsesListActions.editCommentSuccess({ pulseId: pulseId, commentId, text }),
      ),
    );
  });
}
