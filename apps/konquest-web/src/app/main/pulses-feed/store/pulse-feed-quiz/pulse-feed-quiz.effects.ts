import { inject, Injectable } from '@angular/core';
import { AnswerPreviewOutput, QuizApiService } from '@core/api/quiz-api.service';
import { PulseService } from '@core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { PulseDetailsActions } from '../../store';
import { pulseDetailsFeature } from '../pulse-details/pulse-details.feature';
import { pulseFeedQuizFeature } from './pulse-feed-quiz.feature';
import * as PulseFeedQuizActions from './pulse-feed-quiz.actions';

@Injectable()
export class PulseFeedQuizEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly quizApiService = inject(QuizApiService);
  private readonly pulseService = inject(PulseService);

  triggerLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseDetailsActions.loadPulseDetailsSuccess),
      filter(({ data }) => this.pulseService.isQuiz(data.pulse.pulse_type?.id ?? '')),
      map(() => PulseFeedQuizActions.loadPulseFeedQuiz()),
    );
  });

  loadPulseFeedQuiz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseFeedQuizActions.loadPulseFeedQuiz),
      concatLatestFrom(() => this.store.select(pulseDetailsFeature.selectPulse)),
      switchMap(([, apiResponse]) => {
        if (!apiResponse) return of(PulseFeedQuizActions.loadPulseFeedQuizError({ error: 'No pulse data' }));

        return this.quizApiService.getQuizAsConsumer(apiResponse.learn_content_uuid).pipe(
          map((quiz) =>
            PulseFeedQuizActions.loadPulseFeedQuizSuccess({
              quizId: quiz.id,
              questions: quiz.questions,
              pulseName: apiResponse.name,
              pulseDescription: apiResponse.description,
              randomizeQuestions: quiz.randomize_questions,
              randomizeOptions: quiz.randomize_options,
            }),
          ),
          catchError((error) => of(PulseFeedQuizActions.loadPulseFeedQuizError({ error: String(error) }))),
        );
      }),
    );
  });

  saveAnswer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseFeedQuizActions.saveAnswer),
      concatLatestFrom(() => this.store.select(pulseFeedQuizFeature.selectQuizId)),
      switchMap(([{ answer }, quizId]) => {
        if (!quizId) return EMPTY;
        return this.quizApiService.submitAnswer(quizId, answer.id, { options: answer.options }).pipe(
          filter(
            (apiAnswer): apiAnswer is Exclude<typeof apiAnswer, AnswerPreviewOutput> => !('is_preview' in apiAnswer),
          ),
          map((apiAnswer) => PulseFeedQuizActions.saveAnswerSuccess({ questionId: answer.id, answer: apiAnswer })),
          catchError((error) => of(PulseFeedQuizActions.saveAnswerError({ error: String(error) }))),
        );
      }),
    );
  });

  /** Trigger score loading as soon as all questions have been answered. */
  triggerLoadScore$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseFeedQuizActions.saveAnswerSuccess),
      concatLatestFrom(() => [
        this.store.select(pulseFeedQuizFeature.selectQuestionIds),
        this.store.select(pulseFeedQuizFeature.selectQuestionsCache),
      ]),
      filter(([, ids, cache]) => ids.length > 0 && ids.every((id) => !!cache[id]?.answer)),
      map(() => PulseFeedQuizActions.loadScore()),
    );
  });

  /** Load score immediately when a previously completed quiz is re-opened. */
  triggerLoadScoreOnReopen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseFeedQuizActions.loadPulseFeedQuizSuccess),
      filter(({ questions }) => questions.length > 0 && questions.every((q) => q.answer !== null)),
      map(() => PulseFeedQuizActions.loadScore()),
    );
  });

  loadScore$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PulseFeedQuizActions.loadScore),
      concatLatestFrom(() => this.store.select(pulseFeedQuizFeature.selectQuizId)),
      switchMap(([, quizId]) => {
        if (!quizId) return of(PulseFeedQuizActions.loadScoreError({ error: 'No quiz ID' }));
        return this.quizApiService.getScore(quizId).pipe(
          map((score) => PulseFeedQuizActions.loadScoreSuccess({ score })),
          catchError((error) => of(PulseFeedQuizActions.loadScoreError({ error: String(error) }))),
        );
      }),
    );
  });
}
