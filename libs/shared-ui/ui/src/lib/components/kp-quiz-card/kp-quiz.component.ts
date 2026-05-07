import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  ViewChild,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { QuestionRequest, QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpQuizCardService, QuizAnswerEntry } from './kp-quiz.service';
import { QuizCardContentItem } from './model';
import { KpQuizQuestionComponent } from './question/kp-quiz-question.component';
import { KpQuizSummaryComponent } from './summary/kp-quiz-summary.component';
import { QuestionDirective } from './utils/question.directive';

@Component({
  selector: 'kp-quiz-card',
  templateUrl: './kp-quiz.component.html',
  styleUrl: './kp-quiz.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KpQuizCardService],
  imports: [QuestionDirective, MatButton, MatIcon, TranslocoPipe, NgxSkeletonLoaderModule],
})
export class KpQuizCardComponent {
  private readonly _service = inject(KpQuizCardService);

  readonly loading = input<boolean>(false);
  readonly answeringQuiz = input<boolean>(false);
  readonly randomizeQuestions = input<boolean>(false);
  readonly randomizeOptions = input<boolean>(false);
  readonly score = input<QuizScoreOutput | null>(null);
  readonly loadingScore = input<boolean>(false);
  readonly showNextContent = input<boolean>(true);
  readonly questions = input<unknown[]>([]);
  readonly answers = input<QuizAnswerEntry[]>([]);

  readonly finishEvent = outputFromObservable(this._service.nextContent$);
  readonly answerEvent = output<QuestionRequest>();

  @ViewChild(QuestionDirective, { static: true })
  questionHost!: QuestionDirective;

  currentIndex = 0;
  items: QuizCardContentItem[] = [];

  readonly isSelected = toSignal(this._service.selected$, { initialValue: false });
  readonly isAnswered = toSignal(this._service.answered$, { initialValue: false });

  get orderWarnKey(): string | null {
    if (this.randomizeQuestions() && this.randomizeOptions()) return 'UI.QUIZ.ORDER_WARN';
    if (this.randomizeQuestions()) return 'UI.QUIZ.ORDER_WARN_QUESTIONS';
    if (this.randomizeOptions()) return 'UI.QUIZ.ORDER_WARN_OPTIONS';
    return null;
  }

  private componentRef: ComponentRef<unknown> | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => this._service.setScore(this.score()));
    effect(() => this._service.setLoadingScore(this.loadingScore()));
    effect(() => this._service.setShowNextContent(this.showNextContent()));
    effect(() => {
      const ans = this.answers();
      if (ans.length) this._service.setAnswers(ans);
    });
    effect(() => {
      const qs = this.questions();
      if (qs.length) {
        const isFirstLoad = !this.items.length;
        this.items = qs.map((question) => new QuizCardContentItem(KpQuizQuestionComponent, { question }));
        this.items.push(new QuizCardContentItem(KpQuizSummaryComponent, {}));
        if (isFirstLoad) this.loadQuestionComponent(0);
      }
    });

    this._service.goBack$.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
      if (this.items.length >= 2) this.loadQuestionComponent(this.items.length - 2);
    });

    destroyRef.onDestroy(() => this.clear());
  }

  loadQuestionComponent(index: number): void {
    this.currentIndex = index;
    const contentItem = this.items[index];
    this.clear();
    this.componentRef = this.questionHost.viewContainerRef.createComponent(contentItem.component as never);
    (this.componentRef.instance as { data: Record<string, unknown> }).data = contentItem.data;
    const questionId = (contentItem.data['question'] as { id?: string } | undefined)?.id;
    this._service.answered(questionId ?? '');
  }

  next(): void {
    this.loadQuestionComponent(++this.currentIndex);
    this._service.disableSelection();
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.loadQuestionComponent(--this.currentIndex);
    }
  }

  onAnswerer(): void {
    const currentAnswer = this._service.getCurrentSelection();
    if (currentAnswer) this.answerEvent.emit(currentAnswer);
  }

  private clear(): void {
    this.componentRef?.destroy();
    this.questionHost?.viewContainerRef.clear();
    this.componentRef = null;
  }
}
