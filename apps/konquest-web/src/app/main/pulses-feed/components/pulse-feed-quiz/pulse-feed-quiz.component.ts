import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpQuizCardComponent } from '@keeps-platform-frontend-workspace/ui/kp-quiz-card';
import { Store } from '@ngrx/store';
import * as PulseFeedQuizActions from '../../store/pulse-feed-quiz/pulse-feed-quiz.actions';
import { pulseFeedQuizFeature } from '../../store/pulse-feed-quiz/pulse-feed-quiz.feature';
import { PulseDetailsComponent } from '../../containers/pulse-details/pulse-details.component';

@Component({
  selector: 'app-pulse-feed-quiz',
  templateUrl: './pulse-feed-quiz.component.html',
  styleUrl: './pulse-feed-quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpQuizCardComponent, AsyncPipe],
})
export class PulseFeedQuizComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<PulseDetailsComponent>);

  readonly loading$ = this.store.select(pulseFeedQuizFeature.selectLoading);
  readonly questions$ = this.store.select(pulseFeedQuizFeature.selectQuestionsForCard);
  readonly answers$ = this.store.select(pulseFeedQuizFeature.selectAnswersForCard);
  readonly answeringQuiz$ = this.store.select(pulseFeedQuizFeature.selectLoadingAnswer);
  readonly score$ = this.store.select(pulseFeedQuizFeature.selectScore);
  readonly loadingScore$ = this.store.select(pulseFeedQuizFeature.selectLoadingScore);
  readonly randomizeQuestions$ = this.store.select(pulseFeedQuizFeature.selectRandomizeQuestions);
  readonly randomizeOptions$ = this.store.select(pulseFeedQuizFeature.selectRandomizeOptions);

  onAnswer(answer: QuestionRequest): void {
    this.store.dispatch(PulseFeedQuizActions.saveAnswer({ answer }));
  }

  onFinish(): void {
    this.store.dispatch(PulseFeedQuizActions.pulseFeedQuizReset());
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.store.dispatch(PulseFeedQuizActions.pulseFeedQuizReset());
  }
}
