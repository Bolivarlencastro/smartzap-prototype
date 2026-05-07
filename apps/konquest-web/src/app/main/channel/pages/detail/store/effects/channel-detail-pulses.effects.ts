import { Injectable } from '@angular/core';
import { PulseQuizService } from '@core/api/pulse-quiz.service';
import { PulseAPI } from '@core/api/pulse.api';
import { PulsesSearchService } from '@core/api/pulses-search.service';
import { Pulse } from '@core/model/pulse.model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Channel } from 'app/main/channel/channel.model';
import { ChannelDetailPulsesSelectors, ChannelDetailSelectors } from 'app/main/channel/pages/detail/store/selectors';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ChannelAPI } from '../../../../channel.api';
import { ChannelDetailService } from '../../channel-detail.service';
import { QuizActions } from '@keeps-platform-frontend-workspace/quiz';
import { ChannelDetailActions, ChannelDetailPulsesActions } from '../actions';
import { selectChannelDetail } from '../selectors/channel-detail.selectors';

const QUIZ_CONTENT_TYPE_ID = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';

@Injectable()
export class ChannelDetailPulsesEffects {
  getChannelPulses$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailPulsesActions.getChannelPulses),
      filter(({ channelId }) => !!channelId),
      concatLatestFrom(() => this.store.select(ChannelDetailPulsesSelectors.selectChannelPulsesPage)),
      switchMap(([{ channelId }, currentPage]) => {
        return this._pulsesSearchService.fetchChannelPulses(channelId, { page: currentPage }).pipe(
          map((payload) => ChannelDetailPulsesActions.getChannelPulsesSuccess({ payload })),
          catchError(() => of(ChannelDetailPulsesActions.getChannelPulsesFailure())),
        );
      }),
    );
  });

  getChannelPulsesPagination$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailPulsesActions.loadMorePulses),
      concatLatestFrom(() => [
        this.store.select(ChannelDetailPulsesSelectors.selectChannelPulsesFinished),
        this.store.select(ChannelDetailPulsesSelectors.selectChannelPulsesPage),
        this.store.select(ChannelDetailSelectors.selectChannelDetailId),
      ]),
      filter(([_, finished]) => !finished),
      switchMap(([_, _finished, currentPage, channelId]) => {
        return this._pulsesSearchService.fetchChannelPulses(channelId, { page: currentPage + 1 }).pipe(
          map((payload) => ChannelDetailPulsesActions.loadMorePulsesSuccess({ payload })),
          catchError(() => of(ChannelDetailPulsesActions.getChannelPulsesFailure())),
        );
      }),
    );
  });

  openPulseCreateDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailActions.openPulseCreateDialog),
      switchMap(({ channelId }) =>
        this._channelDetailService.openPulseCreateDialog().pipe(
          filter((contentFormData) => !!contentFormData),
          map((contentFormData) => {
            const type = contentFormData.type;
            if (type === 'QUIZ') {
              return QuizActions.openQuizWizardDialog({ channelId });
            }
            return ChannelDetailActions.createNewPulseWithFileUpload({ channelId, pulseFormData: contentFormData });
          }),
        ),
      ),
    );
  });

  createNewPulse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailActions.createNewPulseWithFileUpload),
      concatLatestFrom(() => this.store.select(selectChannelDetail)),
      switchMap(([{ channelId, pulseFormData }, channel]) => {
        return this._channelDetailService.createPulse(channelId, pulseFormData).pipe(
          map((response) =>
            ChannelDetailActions.createNewPulseUploadSuccess({
              pulse: this.buildPulseDto(response, channel),
            }),
          ),
          catchError(() => of(ChannelDetailActions.createNewPulseWithFileUploadFailure())),
        );
      }),
    );
  });

  addPulseBookmark$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailPulsesActions.addPulseBookmark),
      mergeMap(({ pulse }) => {
        return this._pulsesApi.postPulseBookmark({ pulse: pulse.id, user: this._authService.userId }).pipe(
          tap(() => this._messageService.success('PULSES.BOOKMARK.SUCCESSFULLY_ADDED')),
          map((bookmark) => {
            return ChannelDetailPulsesActions.addPulseBookmarkSuccess({
              payload: { id: pulse.id || '', changes: { bookmark_id: bookmark.id } },
            });
          }),
          catchError((error) => of(ChannelDetailPulsesActions.addPulseBookmarkFailure({ error }))),
        );
      }),
    );
  });

  addQuizPulseAfterCreate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(QuizActions.createQuizSuccess),
      concatLatestFrom(() => [
        this.store.select(ChannelDetailSelectors.selectChannelDetailId),
        this.store.select(selectChannelDetail),
      ]),
      filter(([_, channelId]) => !!channelId),
      map(([{ quiz }, _channelId, channel]) =>
        ChannelDetailActions.createNewPulseUploadSuccess({
          pulse: {
            id: quiz.pulse ?? '',
            name: quiz.title,
            channel_name: channel?.name ?? '',
            cover_image: '',
            pulse_type: { id: QUIZ_CONTENT_TYPE_ID, name: '' },
            stats: { duration: 0 },
          },
        }),
      ),
    );
  });

  removePulseBookmark$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailPulsesActions.removePulseBookmark),
      mergeMap(({ pulse }) => {
        return this._pulsesApi.deletePulseBookmark(pulse.bookmark_id).pipe(
          tap(() => this._messageService.success('PULSES.BOOKMARK.SUCCESSFULLY_REMOVED')),
          map(() => {
            return ChannelDetailPulsesActions.removePulseBookmarkSuccess({
              payload: { id: pulse.id || '', changes: { bookmark_id: undefined } },
            });
          }),
          catchError((error) => of(ChannelDetailPulsesActions.removePulseBookmarkFailure({ error }))),
        );
      }),
    );
  });

  constructor(
    private readonly _actions$: Actions,
    private readonly _channelAPI: ChannelAPI,
    private readonly _channelDetailService: ChannelDetailService,
    private readonly store: Store,
    private readonly _messageService: KpMessageService,
    private readonly _quizService: PulseQuizService,
    private readonly _pulsesSearchService: PulsesSearchService,
    private readonly _pulsesApi: PulseAPI,
    private readonly _authService: AuthService,
  ) {}

  private buildPulseDto(pulse: Pulse, channel: Channel): PulseCardDto {
    return {
      id: pulse.id,
      name: pulse.name,
      channel_name: channel.name,
      cover_image: pulse.holder_image,
      pulse_type: { id: pulse.pulse_type as unknown as string, name: '' },
      stats: { duration: pulse.duration_time },
    };
  }
}
