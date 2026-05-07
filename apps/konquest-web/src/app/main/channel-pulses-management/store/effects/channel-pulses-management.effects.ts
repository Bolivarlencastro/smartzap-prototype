import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ChannelPulsesManagementService } from '../../services/channel-pulses-management.service';
import { ChannelPulsesCreateService } from '../../services/channel-pulses-create.service';
import { QuizActions } from '@keeps-platform-frontend-workspace/quiz';
import { ChannelPulsesManagementActions } from '../actions';
import { channelPulsesManagementFeature } from '../features';
import { filter } from 'rxjs/operators';
import { PulseQuizService } from '@core/api/pulse-quiz.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const QUIZ_CONTENT_TYPE_ID = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';

@Injectable()
export class ChannelPulsesManagementEffects {
  loadChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.init),
      switchMap(({ channelId }) =>
        this.service.getChannel(channelId).pipe(
          map((channel) => ChannelPulsesManagementActions.loadChannelSuccess({ channelName: channel.name ?? '' })),
          catchError(() => of(ChannelPulsesManagementActions.loadChannelFailure())),
        ),
      ),
    );
  });

  loadPulses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ChannelPulsesManagementActions.init,
        ChannelPulsesManagementActions.setFilter,
        ChannelPulsesManagementActions.setPagination,
        ChannelPulsesManagementActions.loadPulses,
      ),
      concatLatestFrom(() => [
        this.store.select(channelPulsesManagementFeature.selectChannelId),
        this.store.select(channelPulsesManagementFeature.selectFilter),
      ]),
      switchMap(([_, channelId, filter]) =>
        this.service.fetchChannelPulses(channelId, filter).pipe(
          map(({ pulses, total }) => ChannelPulsesManagementActions.loadPulsesSuccess({ pulses, total })),
          catchError(() => of(ChannelPulsesManagementActions.loadPulsesFailure())),
        ),
      ),
    );
  });

  editPulse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.editPulse),
      switchMap(({ pulseId }) =>
        this.service.getPulse(pulseId).pipe(
          switchMap((pulse) => this.service.openPulseEditDialog(pulse)),
          filter((result) => !!result),
          switchMap((result) =>
            this.service
              .updatePulse(pulseId, {
                name: result.name,
                description: result.description,
                holder_image: result.coverImage,
              })
              .pipe(
                map(() => ChannelPulsesManagementActions.editPulseSuccess()),
                catchError(() => of(ChannelPulsesManagementActions.editPulseFailure())),
              ),
          ),
          catchError(() => of(ChannelPulsesManagementActions.editPulseFailure())),
        ),
      ),
    );
  });

  editContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.editContent),
      switchMap(({ pulseId }) =>
        this.service
          .getPulse(pulseId)
          .pipe(map((pulse) => ChannelPulsesManagementActions.loadPulseForEditionSuccess({ pulse }))),
      ),
    );
  });

  editQuizContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.loadPulseForEditionSuccess),
      filter(({ pulse }) => pulse.pulse_type.id === QUIZ_CONTENT_TYPE_ID),
      map(({ pulse }) => QuizActions.openQuizEditDialog({ quizId: pulse.learn_content_uuid })),
    );
  });

  editPulseContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.loadPulseForEditionSuccess),
      filter(({ pulse }) => pulse.pulse_type.id !== QUIZ_CONTENT_TYPE_ID),
      switchMap(({ pulse }) => {
        return this.service.editPulseContent(pulse);
      }),
      map(() => ChannelPulsesManagementActions.editContentSuccess()),
      catchError(() => of(ChannelPulsesManagementActions.editContentFailure())),
    );
  });

  toggleActivation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.toggleActivation),
      switchMap(({ pulseId, isActive }) =>
        this.service.toggleActivation(pulseId, !isActive).pipe(
          map(() => ChannelPulsesManagementActions.toggleActivationSuccess()),
          catchError(() => of(ChannelPulsesManagementActions.toggleActivationFailure())),
        ),
      ),
    );
  });

  deletePulse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.deletePulse),
      switchMap(({ pulseId }) =>
        this.service.openDeleteConfirmDialog().pipe(
          filter((confirmed) => confirmed === true),
          switchMap(() =>
            this.service.deletePulse(pulseId).pipe(
              map(() => ChannelPulsesManagementActions.deletePulseSuccess()),
              catchError(() => of(ChannelPulsesManagementActions.deletePulseFailure())),
            ),
          ),
        ),
      ),
    );
  });

  openPulseCreateDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.createPulse),
      concatLatestFrom(() => this.store.select(channelPulsesManagementFeature.selectChannelId)),
      switchMap(([_, channelId]) =>
        this.createService.openPulseCreateDialog().pipe(
          filter((contentFormData) => !!contentFormData),
          map((contentFormData) => {
            if (contentFormData.type === 'QUIZ') {
              return QuizActions.openQuizWizardDialog({ channelId });
            }
            return ChannelPulsesManagementActions.createNewPulseWithFileUpload({
              channelId,
              pulseFormData: contentFormData,
            });
          }),
        ),
      ),
    );
  });

  createNewPulseWithFileUpload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelPulsesManagementActions.createNewPulseWithFileUpload),
      switchMap(({ channelId, pulseFormData }) =>
        this.createService.createPulse(channelId, pulseFormData).pipe(
          map(() => ChannelPulsesManagementActions.createPulseSuccess()),
          catchError(() => of(ChannelPulsesManagementActions.createPulseFailure())),
        ),
      ),
    );
  });

  reloadAfterMutation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ChannelPulsesManagementActions.editPulseSuccess,
        ChannelPulsesManagementActions.editContentSuccess,
        ChannelPulsesManagementActions.toggleActivationSuccess,
        ChannelPulsesManagementActions.deletePulseSuccess,
        ChannelPulsesManagementActions.createPulseSuccess,
      ),
      map(() => ChannelPulsesManagementActions.loadPulses()),
    );
  });

  reloadAfterQuizSaved$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.createQuizSuccess, QuizActions.updateQuizSuccess),
      concatLatestFrom(() => this.store.select(channelPulsesManagementFeature.selectChannelId)),
      filter(([_, channelId]) => !!channelId),
      map(() => ChannelPulsesManagementActions.loadPulses()),
    );
  });

  mutationFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ChannelPulsesManagementActions.editPulseFailure,
          ChannelPulsesManagementActions.editContentFailure,
          ChannelPulsesManagementActions.toggleActivationFailure,
          ChannelPulsesManagementActions.deletePulseFailure,
          ChannelPulsesManagementActions.createPulseFailure,
        ),
        tap(() => this.service.showMutationError()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly service: ChannelPulsesManagementService,
    private readonly createService: ChannelPulsesCreateService,
    private readonly quizService: PulseQuizService,
    private readonly messageService: KpMessageService,
  ) {}
}
