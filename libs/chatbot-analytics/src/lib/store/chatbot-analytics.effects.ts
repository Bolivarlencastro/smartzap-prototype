import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ChatbotAnalyticsActions, chatbotAnalyticsFeature } from '.';
import { ChatbotAnalyticsService } from '../services/chatbot-analytics.service';

@Injectable()
export class ChatbotAnalyticsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: ChatbotAnalyticsService,
    private readonly store: Store,
  ) {}

  startAgent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatbotAnalyticsActions.startAgent),
      switchMap(({ report_id }) =>
        this.service
          .startAgent(report_id)
          .pipe(map((sessionToken) => ChatbotAnalyticsActions.startAgentSuccess({ sessionToken }))),
      ),
    );
  });

  sendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatbotAnalyticsActions.sendMessage),
      concatLatestFrom(() => this.store.select(chatbotAnalyticsFeature.selectSessionToken)),
      switchMap(([{ text }, token]) =>
        this.service.sendMessage(text, token).pipe(
          map((answer) => ChatbotAnalyticsActions.generateFollowupQuestions({ answer })),
          catchError(() => of(ChatbotAnalyticsActions.messageError())),
        ),
      ),
    );
  });

  generateFollowupQuestions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatbotAnalyticsActions.generateFollowupQuestions),
      concatLatestFrom(() => this.store.select(chatbotAnalyticsFeature.selectSessionToken)),
      switchMap(([{ answer }, sessionToken]) =>
        this.service.generateFollowupQuestions(answer, sessionToken).pipe(
          map((response) => ChatbotAnalyticsActions.messageSuccess({ response })),
          catchError(() => of(ChatbotAnalyticsActions.messageError())),
        ),
      ),
    );
  });

  generateTable$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatbotAnalyticsActions.generateTable),
      switchMap(({ token }) =>
        this.service.generateTable(token).pipe(
          map((response) => ChatbotAnalyticsActions.messageSuccess({ response })),
          catchError(() => of(ChatbotAnalyticsActions.messageError())),
        ),
      ),
    );
  });

  generatePlot$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatbotAnalyticsActions.generatePlot),
      switchMap(({ token }) =>
        this.service.generatePlot(token).pipe(
          map((response) => ChatbotAnalyticsActions.messageSuccess({ response })),
          catchError(() => of(ChatbotAnalyticsActions.messageError())),
        ),
      ),
    );
  });

  downloadCSV$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChatbotAnalyticsActions.downloadCSV),
        switchMap(({ token }) => this.service.downloadCSV(token).pipe(map((res) => this.service.saveCSV(res)))),
      );
    },
    { dispatch: false },
  );
}
